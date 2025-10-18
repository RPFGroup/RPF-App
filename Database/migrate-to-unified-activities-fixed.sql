-- ============================================================
-- 🎯 UNIFIED ACTIVITIES SYSTEM MIGRATION - FIXED VERSION
-- ============================================================
-- This script migrates from dual-table system to unified system
-- Using project_type_activities as the single source of truth
-- ============================================================

-- ============================================================
-- STEP 0: PRE-MIGRATION CLEANUP AND VALIDATION
-- ============================================================

-- Check and fix invalid project types in project_type_activities
DO $$ 
DECLARE
    invalid_count INTEGER;
BEGIN
    -- Count invalid project types
    SELECT COUNT(DISTINCT project_type) INTO invalid_count
    FROM project_type_activities
    WHERE project_type NOT IN (SELECT name FROM project_types);
    
    IF invalid_count > 0 THEN
        RAISE NOTICE '⚠️ Found % invalid project types. Fixing...', invalid_count;
        
        -- Update invalid project types to 'General Construction'
        UPDATE project_type_activities
        SET project_type = 'General Construction'
        WHERE project_type NOT IN (SELECT name FROM project_types);
        
        RAISE NOTICE '✅ Fixed invalid project types';
    ELSE
        RAISE NOTICE '✅ All project types are valid';
    END IF;
END $$;

-- Show current project types in both tables
SELECT 
    '📊 Project Types in project_types table' as info,
    string_agg(name, ', ' ORDER BY name) as types
FROM project_types
WHERE is_active = true;

SELECT 
    '📊 Project Types in project_type_activities table' as info,
    string_agg(DISTINCT project_type, ', ' ORDER BY project_type) as types
FROM project_type_activities;

-- ============================================================
-- STEP 1: ADD MISSING COLUMNS TO project_type_activities
-- ============================================================

-- Add typical_duration (from activities table)
ALTER TABLE project_type_activities 
ADD COLUMN IF NOT EXISTS typical_duration INTEGER;

-- Add division (from activities table)
ALTER TABLE project_type_activities 
ADD COLUMN IF NOT EXISTS division TEXT;

-- Add usage_count (from activities table)
ALTER TABLE project_type_activities 
ADD COLUMN IF NOT EXISTS usage_count INTEGER DEFAULT 0;

COMMENT ON COLUMN project_type_activities.typical_duration IS 'Typical duration for this activity in days';
COMMENT ON COLUMN project_type_activities.division IS 'Division responsible for this activity (legacy field)';
COMMENT ON COLUMN project_type_activities.usage_count IS 'Number of times this activity has been used';

RAISE NOTICE '✅ Added missing columns';

-- ============================================================
-- STEP 2: ADD FOREIGN KEY CONSTRAINT (SAFELY)
-- ============================================================

DO $$ 
BEGIN
    -- Check if constraint already exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_project_type'
        AND table_name = 'project_type_activities'
    ) THEN
        -- Verify all project types are valid before adding constraint
        IF NOT EXISTS (
            SELECT 1 FROM project_type_activities
            WHERE project_type NOT IN (SELECT name FROM project_types)
        ) THEN
            ALTER TABLE project_type_activities
            ADD CONSTRAINT fk_project_type 
            FOREIGN KEY (project_type) 
            REFERENCES project_types(name) 
            ON UPDATE CASCADE
            ON DELETE RESTRICT;
            
            RAISE NOTICE '✅ Added foreign key constraint';
        ELSE
            RAISE NOTICE '⚠️ Cannot add foreign key: invalid project types still exist';
        END IF;
    ELSE
        RAISE NOTICE '✅ Foreign key constraint already exists';
    END IF;
END $$;

-- ============================================================
-- STEP 3: CREATE BACKUP OF ACTIVITIES TABLE
-- ============================================================

-- Drop backup if exists
DROP TABLE IF EXISTS activities_backup CASCADE;

-- Create backup table
CREATE TABLE activities_backup AS SELECT * FROM activities;

-- Add timestamp to backup
ALTER TABLE activities_backup ADD COLUMN IF NOT EXISTS backup_date TIMESTAMP DEFAULT NOW();

-- Report
SELECT 
    '✅ Backup created with ' || COUNT(*) || ' records' as backup_status 
FROM activities_backup;

-- ============================================================
-- STEP 4: MIGRATE DATA FROM activities TO project_type_activities
-- ============================================================

-- Function to map division to project type
CREATE OR REPLACE FUNCTION map_division_to_project_type(div TEXT) 
RETURNS TEXT AS $$
DECLARE
    result TEXT;
BEGIN
    -- Try exact match first
    SELECT name INTO result
    FROM project_types 
    WHERE name = div
    LIMIT 1;
    
    IF result IS NOT NULL THEN
        RETURN result;
    END IF;
    
    -- Try case-insensitive match
    SELECT name INTO result
    FROM project_types 
    WHERE LOWER(name) = LOWER(div)
    LIMIT 1;
    
    IF result IS NOT NULL THEN
        RETURN result;
    END IF;
    
    -- Try partial match
    SELECT name INTO result
    FROM project_types 
    WHERE name ILIKE '%' || div || '%' 
    OR code ILIKE '%' || div || '%'
    LIMIT 1;
    
    IF result IS NOT NULL THEN
        RETURN result;
    END IF;
    
    -- Default fallback
    RETURN 'General Construction';
END;
$$ LANGUAGE plpgsql;

-- Migrate data
INSERT INTO project_type_activities (
    project_type,
    activity_name,
    default_unit,
    category,
    description,
    typical_duration,
    division,
    usage_count,
    is_active,
    is_default,
    display_order,
    created_at,
    updated_at
)
SELECT 
    map_division_to_project_type(a.division) as project_type,
    a.name as activity_name,
    a.unit as default_unit,
    a.category,
    a.description,
    a.typical_duration,
    a.division,
    COALESCE(a.usage_count, 0) as usage_count,
    COALESCE(a.is_active, true) as is_active,
    false as is_default,
    0 as display_order,
    COALESCE(a.created_at, NOW()) as created_at,
    COALESCE(a.updated_at, NOW()) as updated_at
FROM activities a
WHERE NOT EXISTS (
    SELECT 1 FROM project_type_activities pta
    WHERE pta.activity_name = a.name
    AND pta.project_type = map_division_to_project_type(a.division)
)
ON CONFLICT (project_type, activity_name) DO UPDATE SET
    -- Update existing records with combined data
    default_unit = COALESCE(EXCLUDED.default_unit, project_type_activities.default_unit),
    category = COALESCE(EXCLUDED.category, project_type_activities.category),
    description = COALESCE(EXCLUDED.description, project_type_activities.description),
    typical_duration = COALESCE(EXCLUDED.typical_duration, project_type_activities.typical_duration),
    division = COALESCE(EXCLUDED.division, project_type_activities.division),
    usage_count = COALESCE(project_type_activities.usage_count, 0) + COALESCE(EXCLUDED.usage_count, 0),
    is_active = COALESCE(EXCLUDED.is_active, project_type_activities.is_active),
    updated_at = NOW();

-- Drop the mapping function (cleanup)
DROP FUNCTION IF EXISTS map_division_to_project_type(TEXT);

-- Report migration results
SELECT 
    '✅ Migration completed: ' || COUNT(*) || ' activities in unified table' as migration_status
FROM project_type_activities;

-- ============================================================
-- STEP 5: CREATE INDEXES FOR PERFORMANCE
-- ============================================================

-- Create indexes for the new columns
CREATE INDEX IF NOT EXISTS idx_project_type_activities_division 
    ON project_type_activities(division);

CREATE INDEX IF NOT EXISTS idx_project_type_activities_usage 
    ON project_type_activities(usage_count DESC);

CREATE INDEX IF NOT EXISTS idx_project_type_activities_duration 
    ON project_type_activities(typical_duration);

RAISE NOTICE '✅ Created indexes';

-- ============================================================
-- STEP 6: CREATE/UPDATE HELPER FUNCTIONS
-- ============================================================

-- Function to increment usage count
CREATE OR REPLACE FUNCTION increment_activity_usage_unified(
    p_project_type TEXT,
    p_activity_name TEXT
)
RETURNS VOID AS $$
BEGIN
    UPDATE project_type_activities 
    SET usage_count = COALESCE(usage_count, 0) + 1,
        updated_at = NOW()
    WHERE project_type = p_project_type 
    AND activity_name = p_activity_name;
END;
$$ LANGUAGE plpgsql;

-- Function to get activities by project type
CREATE OR REPLACE FUNCTION get_activities_by_project_type_unified(
    p_project_type TEXT,
    p_include_inactive BOOLEAN DEFAULT false
)
RETURNS TABLE (
    id UUID,
    project_type VARCHAR,
    activity_name VARCHAR,
    activity_name_ar VARCHAR,
    description TEXT,
    default_unit VARCHAR,
    estimated_rate DECIMAL,
    category VARCHAR,
    typical_duration INTEGER,
    division TEXT,
    usage_count INTEGER,
    is_active BOOLEAN,
    display_order INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pta.id,
        pta.project_type,
        pta.activity_name,
        pta.activity_name_ar,
        pta.description,
        pta.default_unit,
        pta.estimated_rate,
        pta.category,
        pta.typical_duration,
        pta.division,
        pta.usage_count,
        pta.is_active,
        pta.display_order
    FROM project_type_activities pta
    WHERE pta.project_type = p_project_type
    AND (p_include_inactive = true OR pta.is_active = true)
    ORDER BY pta.display_order, pta.usage_count DESC, pta.activity_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get all activities grouped by category
CREATE OR REPLACE FUNCTION get_activities_by_category(
    p_project_type TEXT
)
RETURNS TABLE (
    category TEXT,
    activity_count BIGINT,
    activities JSON
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pta.category,
        COUNT(*) as activity_count,
        json_agg(
            json_build_object(
                'id', pta.id,
                'name', pta.activity_name,
                'unit', pta.default_unit,
                'usage_count', pta.usage_count
            ) ORDER BY pta.display_order, pta.activity_name
        ) as activities
    FROM project_type_activities pta
    WHERE pta.project_type = p_project_type
    AND pta.is_active = true
    GROUP BY pta.category
    ORDER BY activity_count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get activity statistics
CREATE OR REPLACE FUNCTION get_unified_activity_stats()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_activities', (SELECT COUNT(*) FROM project_type_activities WHERE is_active = true),
        'by_project_type', (
            SELECT json_object_agg(project_type, activity_count)
            FROM (
                SELECT project_type, COUNT(*) as activity_count
                FROM project_type_activities
                WHERE is_active = true
                GROUP BY project_type
            ) pt
        ),
        'by_category', (
            SELECT json_object_agg(category, activity_count)
            FROM (
                SELECT category, COUNT(*) as activity_count
                FROM project_type_activities
                WHERE is_active = true AND category IS NOT NULL
                GROUP BY category
            ) cat
        ),
        'most_used', (
            SELECT json_agg(
                json_build_object(
                    'activity_name', activity_name,
                    'project_type', project_type,
                    'usage_count', usage_count
                )
            )
            FROM (
                SELECT activity_name, project_type, usage_count
                FROM project_type_activities
                WHERE is_active = true
                ORDER BY usage_count DESC
                LIMIT 10
            ) top
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

RAISE NOTICE '✅ Created helper functions';

-- ============================================================
-- STEP 7: UPDATE TRIGGERS
-- ============================================================

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_unified_activities_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_unified_activities_timestamp 
    ON project_type_activities;

CREATE TRIGGER trigger_update_unified_activities_timestamp
    BEFORE UPDATE ON project_type_activities
    FOR EACH ROW
    EXECUTE FUNCTION update_unified_activities_timestamp();

RAISE NOTICE '✅ Created triggers';

-- ============================================================
-- STEP 8: CREATE VIEWS FOR BACKWARD COMPATIBILITY
-- ============================================================

-- View to emulate old activities table structure
CREATE OR REPLACE VIEW v_activities_legacy AS
SELECT 
    id,
    activity_name as name,
    division,
    default_unit as unit,
    category,
    description,
    typical_duration,
    is_active,
    usage_count,
    created_at,
    updated_at
FROM project_type_activities;

-- View for statistics
CREATE OR REPLACE VIEW v_activity_stats AS
SELECT 
    project_type,
    category,
    COUNT(*) as activity_count,
    SUM(usage_count) as total_usage,
    AVG(usage_count) as avg_usage,
    MAX(usage_count) as max_usage
FROM project_type_activities
WHERE is_active = true
GROUP BY project_type, category;

RAISE NOTICE '✅ Created views';

-- ============================================================
-- STEP 9: VERIFICATION QUERIES
-- ============================================================

-- Compare counts
SELECT 
    'Activities (old backup)' as source,
    COUNT(*) as count
FROM activities_backup
UNION ALL
SELECT 
    'Project Type Activities (unified)' as source,
    COUNT(*) as count
FROM project_type_activities;

-- Show migration summary by project type
SELECT 
    project_type,
    COUNT(*) as activity_count,
    SUM(usage_count) as total_usage,
    COUNT(DISTINCT category) as category_count
FROM project_type_activities
WHERE is_active = true
GROUP BY project_type
ORDER BY activity_count DESC;

-- Show all project types
SELECT 
    '📊 All Project Types in System' as info,
    string_agg(DISTINCT project_type, ', ' ORDER BY project_type) as types
FROM project_type_activities;

-- ============================================================
-- ✅ MIGRATION COMPLETE!
-- ============================================================

SELECT 
    '🎉 UNIFIED ACTIVITIES SYSTEM MIGRATION COMPLETE! 🎉' as status,
    (SELECT COUNT(*) FROM project_type_activities WHERE is_active = true) as total_activities,
    (SELECT COUNT(DISTINCT project_type) FROM project_type_activities) as project_types,
    (SELECT COUNT(DISTINCT category) FROM project_type_activities WHERE category IS NOT NULL) as categories;
