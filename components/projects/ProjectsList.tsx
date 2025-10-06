'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { getSupabaseClient } from '@/lib/supabaseConnectionManager'
import { useComponentStability } from '@/lib/componentStability'
import { Project, TABLES } from '@/lib/supabase'
import { mapProjectFromDB, mapProjectToDB, mapBOQFromDB, mapKPIFromDB } from '@/lib/dataMappers'
import { calculateProjectAnalytics } from '@/lib/projectAnalytics'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Alert } from '@/components/ui/Alert'
import { IntelligentProjectForm } from './IntelligentProjectForm'
import { ProjectCard } from './ProjectCard'
import { ProjectCardWithAnalytics } from './ProjectCardWithAnalytics'
import { ProjectDetailsPanel } from './ProjectDetailsPanel'
// import { ProjectsTable } from './ProjectsTable' // ✅ Removed - Table view deleted
import { AdvancedSorting, SortOption, FilterOption } from '@/components/ui/AdvancedSorting'
import { Pagination } from '@/components/ui/Pagination'
import { Plus, Search, Building, Calendar, DollarSign, Percent, Hash, CheckCircle, Clock, AlertCircle, Folder, BarChart3, Grid } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { SmartFilter } from '@/components/ui/SmartFilter'

interface ProjectsListProps {
  globalSearchTerm?: string
  globalFilters?: {
    project: string
    status: string
    division: string
    dateRange: string
  }
}

export function ProjectsList({ globalSearchTerm = '', globalFilters = { project: '', status: '', division: '', dateRange: '' } }: ProjectsListProps = {}) {
  const [projects, setProjects] = useState<Project[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [allActivities, setAllActivities] = useState<any[]>([])
  const [allKPIs, setAllKPIs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [viewingProject, setViewingProject] = useState<Project | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [useEnhancedCards, setUseEnhancedCards] = useState(true) // Enabled by default for better UX
  const [viewMode, setViewMode] = useState<'cards' | 'enhanced'>('cards') // Default to cards view
  
  // Smart Filter State
  const [selectedProjectCodes, setSelectedProjectCodes] = useState<string[]>([])
  const [selectedDivisions, setSelectedDivisions] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10) // 10 items per page
  
  // Advanced sorting and filtering states
  const [currentSort, setCurrentSort] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null)
  const [currentFilters, setCurrentFilters] = useState<Record<string, any>>({})
  const [currentProjectCode, setCurrentProjectCode] = useState<string>('')
  
  const supabase = getSupabaseClient() // ✅ Use managed connection
  const isMountedRef = useRef(true) // ✅ Track if component is mounted
  const stability = useComponentStability('ProjectsList') // ✅ Track component stability

  // Sort options for projects
  const sortOptions: SortOption[] = [
    { key: 'project_name', label: 'Project Name', icon: Folder, type: 'string' },
    { key: 'project_code', label: 'Project Code', icon: Hash, type: 'string' },
    { key: 'project_type', label: 'Project Type', icon: Building, type: 'string' },
    { key: 'responsible_division', label: 'Responsible Division', icon: Building, type: 'string' },
    { key: 'project_status', label: 'Project Status', icon: CheckCircle, type: 'string' },
    { key: 'contract_amount', label: 'Contract Amount', icon: DollarSign, type: 'number' },
    { key: 'created_at', label: 'Created Date', icon: Calendar, type: 'date' },
    { key: 'updated_at', label: 'Updated Date', icon: Calendar, type: 'date' }
  ]

  // Filter options for projects
  const filterOptions: FilterOption[] = [
    {
      key: 'project_status',
      label: 'Project Status',
      type: 'select',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'completed', label: 'Completed' },
        { value: 'on_hold', label: 'On Hold' },
        { value: 'cancelled', label: 'Cancelled' }
      ]
    },
    {
      key: 'project_type',
      label: 'Project Type',
      type: 'select',
      options: Array.from(new Set(projects.map(p => p.project_type).filter(Boolean))).map(type => ({
        value: type,
        label: type
      }))
    },
    {
      key: 'responsible_division',
      label: 'Responsible Division',
      type: 'select',
      options: Array.from(new Set(projects.map(p => p.responsible_division).filter(Boolean))).map(division => ({
        value: division,
        label: division
      }))
    },
    {
      key: 'contract_amount',
      label: 'Contract Amount (Greater than)',
      type: 'number',
      placeholder: 'Example: 100000'
    }
  ]

  // Handle sorting
  const handleSortChange = (sortKey: string, direction: 'asc' | 'desc') => {
    setCurrentSort({ key: sortKey, direction })
  }

  // Handle filtering
  const handleFilterChange = (filters: Record<string, any>) => {
    setCurrentFilters(filters)
  }

  // Handle project code filtering
  const handleProjectCodeFilter = (projectCode: string) => {
    setCurrentProjectCode(projectCode)
  }

  // Apply sorting and filtering to projects
  const getFilteredAndSortedProjects = () => {
    let filtered = [...projects]

    // Apply project code filter
    if (currentProjectCode) {
      filtered = filtered.filter(project => 
        project.project_code?.toLowerCase().includes(currentProjectCode.toLowerCase())
      )
    }

    // Apply other filters
    Object.entries(currentFilters).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        filtered = filtered.filter(project => {
          const projectValue = project[key as keyof Project]
          
          if (typeof value === 'string' && typeof projectValue === 'string') {
            return projectValue.toLowerCase().includes(value.toLowerCase())
          }
          
          if (typeof value === 'number' && typeof projectValue === 'number') {
            return projectValue >= value
          }
          
          if (typeof value === 'string' && typeof projectValue === 'boolean') {
            return projectValue === (value === 'true')
          }
          
          return projectValue === value
        })
      }
    })

    // Apply sorting
    if (currentSort) {
      filtered.sort((a, b) => {
        const aValue = a[currentSort.key as keyof Project]
        const bValue = b[currentSort.key as keyof Project]
        
        if (aValue === null || aValue === undefined) return 1
        if (bValue === null || bValue === undefined) return -1
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return currentSort.direction === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue)
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return currentSort.direction === 'asc' 
            ? aValue - bValue
            : bValue - aValue
        }
        
        if (typeof aValue === 'string' && typeof bValue === 'string' && 
            !isNaN(Date.parse(aValue)) && !isNaN(Date.parse(bValue))) {
          const aDate = new Date(aValue)
          const bDate = new Date(bValue)
          return currentSort.direction === 'asc' 
            ? aDate.getTime() - bDate.getTime()
            : bDate.getTime() - aDate.getTime()
        }
        
        return 0
      })
    }

    return filtered
  }

  // Fetch projects with pagination
  const fetchProjects = useCallback(async (page: number) => {
      try {
        setLoading(true)
        setError('')
        
      console.log(`📄 Fetching page ${page} (${itemsPerPage} items per page)`)
      
      // Calculate range for pagination
      const from = (page - 1) * itemsPerPage
      const to = from + itemsPerPage - 1
      
      // Get total count
      const { count } = await supabase
        .from(TABLES.PROJECTS)
        .select('*', { count: 'exact', head: true })
      
      // Fetch paginated projects
      const { data: projectsData, error: projectsError } = await supabase
            .from(TABLES.PROJECTS)
            .select('*')
        .order('created_at', { ascending: false })
        .range(from, to)

      // ✅ ALWAYS update state (React handles unmounted safely)

      if (projectsError) {
        console.error('❌ Error fetching projects:', projectsError)
        setError(projectsError.message)
        setProjects([])
      } else {
        console.log(`✅ Fetched ${projectsData?.length || 0} projects (page ${page})`)
        
        const mappedProjects = (projectsData || []).map(mapProjectFromDB)
        setProjects(mappedProjects)
        setTotalCount(count || 0)
        
        // Only load activities and KPIs if enhanced cards are enabled
        if (useEnhancedCards && mappedProjects.length > 0) {
          console.log('📊 Loading activities and KPIs for enhanced cards...')
          
          // Get project codes for current page
          const projectCodes = mappedProjects.map(p => p.project_code)
          
          const [activitiesResult, kpisResult] = await Promise.all([
          supabase
            .from(TABLES.BOQ_ACTIVITIES)
              .select('*')
              .in('Project Code', projectCodes),
          supabase
              .from(TABLES.KPI)
            .select('*')
              .in('Project Code', projectCodes)
          ])
          
          const mappedActivities = (activitiesResult.data || []).map(mapBOQFromDB)
          const mappedKPIs = (kpisResult.data || []).map(mapKPIFromDB)
          
          setAllActivities(mappedActivities)
          setAllKPIs(mappedKPIs)
          
          console.log(`✅ Loaded ${mappedActivities.length} activities and ${mappedKPIs.length} KPIs`)
        }
        }
      } catch (error: any) {
      console.error('❌ Exception:', error)
        setError('Failed to fetch data. Please check your connection.')
        setProjects([])
      } finally {
        setLoading(false)
    }
  }, [itemsPerPage, useEnhancedCards]) // ✅ FIXED: Removed supabase to prevent infinite loop

  useEffect(() => {
    isMountedRef.current = true
    stability.trackMount() // ✅ Track component mount
    
    // ✅ Initial load: Fetch ONLY projects list for filter dropdown (lightweight)
    // NO full project details, NO activities, NO KPIs
    const fetchProjectsForFilter = async () => {
      try {
        setLoading(true)
        console.log('🟡 Projects: Fetching projects list for filters...')
        
        // Fetch ALL fields to avoid column errors (still lightweight - just project count)
        const { data: projectsData, error: projectsError } = await supabase
          .from(TABLES.PROJECTS)
          .select('*')
          .order('created_at', { ascending: false })
        
        // ✅ ALWAYS update state (React handles unmounted safely)
        
        if (projectsError) {
          console.error('❌ Supabase Error loading projects:', projectsError)
          setError(`Failed to load projects: ${projectsError.message || 'Unknown error'}`)
          return
        }
        
        if (projectsData) {
          const mappedProjects = projectsData.map(mapProjectFromDB)
          setProjects(mappedProjects)
          setTotalCount(mappedProjects.length)
          console.log('✅ Projects: Loaded', mappedProjects.length, 'projects')
          console.log('💡 All projects loaded - filtering is now client-side!')
        }
      } catch (error: any) {
        console.error('❌ Exception loading projects:', error)
        setError(error.message || 'Failed to load projects')
      } finally {
        // ✅ ALWAYS stop loading (React handles unmounted safely)
        setLoading(false)
      }
    }
    
    fetchProjectsForFilter()
    
    // Cleanup function to prevent memory leaks and hanging
    return () => {
      stability.trackUnmount() // ✅ Track component unmount
      isMountedRef.current = false
    }
  }, []) // Empty dependency - run ONCE only!
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCreateProject = async (projectData: Partial<Project>) => {
    try {
      const dbData = mapProjectToDB(projectData)

      const { data, error } = await (supabase
        .from(TABLES.PROJECTS) as any)
        .insert([dbData])
        .select()
        .single()

      if (error) throw error
      
      setShowForm(false)
      // Reload current page
      fetchProjects(currentPage)
    } catch (error: any) {
      setError(error.message)
    }
  }

  const handleUpdateProject = async (id: string, projectData: Partial<Project>) => {
    try {
      const dbData = mapProjectToDB(projectData)

      const { data, error } = await (supabase
        .from(TABLES.PROJECTS) as any)
        .update(dbData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      
      setEditingProject(null)
      // Reload current page
      fetchProjects(currentPage)
    } catch (error: any) {
      setError(error.message)
    }
  }

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return
    
    try {
      const { error } = await supabase
        .from(TABLES.PROJECTS)
        .delete()
        .eq('id', id)

      if (error) throw error
      
      // Reload current page
      fetchProjects(currentPage)
    } catch (error: any) {
      setError(error.message)
    }
  }

  // Get filtered and sorted projects with Smart Filter
  const filteredProjects = getFilteredAndSortedProjects().filter(project => {
    // Search filter
    const matchesSearch = (project.project_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (project.project_code?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    if (!matchesSearch) return false
    
    // Multi-Project Code filter (Smart Filter)
    if (selectedProjectCodes.length > 0) {
      if (!selectedProjectCodes.includes(project.project_code)) return false
    }
    
    // Multi-Status filter (Smart Filter)
    if (selectedStatuses.length > 0) {
      const matchesStatus = selectedStatuses.some(status =>
        project.project_status?.toLowerCase() === status.toLowerCase()
      )
      if (!matchesStatus) return false
    }
    
    // Multi-Division filter (Smart Filter)
    if (selectedDivisions.length > 0) {
      const matchesDivision = selectedDivisions.some(division =>
        project.responsible_division?.toLowerCase() === division.toLowerCase()
      )
      if (!matchesDivision) return false
    }
    
    return true
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'on_hold': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active'
      case 'completed': return 'Completed'
      case 'on_hold': return 'On Hold'
      case 'cancelled': return 'Cancelled'
      default: return status
    }
  }

  // Don't show full-page loading - show inline indicator instead
  const isInitialLoad = loading && projects.length === 0

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Project Management</h2>
            {loading && (
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-full animate-pulse">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                <span className="text-xs text-blue-600 dark:text-blue-400">Syncing...</span>
              </div>
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage and track all projects with smart analytics</p>
        </div>
        <div className="flex gap-2">
          {/* Enhanced View Mode Toggle */}
          <div className="flex gap-1 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-1 shadow-sm">
            <Button
              variant={viewMode === 'cards' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('cards')}
              className="flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 hover:scale-105"
              title="Standard Cards View"
            >
              <Grid className="h-4 w-4" />
              <span className="hidden sm:inline font-medium">Standard</span>
            </Button>
          <Button 
              variant={viewMode === 'enhanced' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('enhanced')}
              className="flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 hover:scale-105"
              title="Enhanced Analytics View"
            >
                <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline font-medium">Analytics</span>
          </Button>
          </div>
          
          <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add New Project</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>
      
      {/* Smart Filter */}
      <SmartFilter
        projects={projects.map(p => ({ 
          project_code: p.project_code, 
          project_name: p.project_name 
        }))}
        activities={[]} // No activities filter for projects page
        selectedProjects={selectedProjectCodes}
        selectedActivities={selectedDivisions} // Use divisions as "activities"
        selectedTypes={selectedTypes}
        selectedStatuses={selectedStatuses}
        onProjectsChange={(projectCodes) => {
          console.log(`🔍 Filter: Selected ${projectCodes.length} project(s)`)
          setSelectedProjectCodes(projectCodes)
          setCurrentPage(1)
          // ✅ No re-fetch! Filtering happens client-side via filteredProjects
        }}
        onActivitiesChange={(divisions) => {
          console.log(`🔍 Filter: Selected divisions:`, divisions)
          setSelectedDivisions(divisions)
          setCurrentPage(1)
        }}
        onTypesChange={(types) => {
          console.log(`🔍 Filter: Selected types:`, types)
          setSelectedTypes(types)
          setCurrentPage(1)
        }}
        onStatusesChange={(statuses) => {
          console.log(`🔍 Filter: Selected statuses:`, statuses)
          setSelectedStatuses(statuses)
          setCurrentPage(1)
          // ✅ No re-fetch! Filtering happens client-side via filteredProjects
        }}
        onClearAll={() => {
          console.log('🔄 Clearing all project filters...')
          setSelectedProjectCodes([])
          setSelectedDivisions([])
          setSelectedTypes([])
          setSelectedStatuses([])
          setCurrentPage(1)
        }}
      />

      {error && (
        <Alert variant="error">
          {error}
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="md:w-auto">
              <AdvancedSorting
                sortOptions={sortOptions}
                filterOptions={filterOptions}
                onSortChange={handleSortChange}
                onFilterChange={handleFilterChange}
                onProjectCodeFilter={handleProjectCodeFilter}
                projects={projects.map(p => ({ project_code: p.project_code, project_name: p.project_name }))}
                currentSort={currentSort || undefined}
                currentFilters={currentFilters}
                currentProjectCode={currentProjectCode}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Show "no results" message only if filters are applied but no matches */}
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
                <div>
                <p className="text-gray-500 dark:text-gray-400">No projects match your filters</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try adjusting your filters or search terms</p>
                </div>
            </div>
          ) : (
            // ✨ Enhanced Card Views - No more table view!
            <div className={`grid gap-6 ${
              viewMode === 'enhanced' 
                ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' 
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}>
              {filteredProjects.map((project) => {
                // Calculate analytics for this project (using pre-loaded data)
                const analytics = viewMode === 'enhanced' 
                  ? calculateProjectAnalytics(project, allActivities, allKPIs)
                  : null
                
                return viewMode === 'enhanced' ? (
                  <ProjectCardWithAnalytics
                    key={project.id}
                    project={project}
                    analytics={analytics}
                    onEdit={setEditingProject}
                    onDelete={handleDeleteProject}
                    onViewDetails={setViewingProject}
                    getStatusColor={getStatusColor}
                    getStatusText={getStatusText}
                  />
                ) : (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onEdit={setEditingProject}
                    onDelete={handleDeleteProject}
                    onViewDetails={setViewingProject}
                    getStatusColor={getStatusColor}
                    getStatusText={getStatusText}
                  />
                )
              })}
            </div>
          )}
        </CardContent>
        
        {/* Pagination */}
        {totalCount > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(totalCount / itemsPerPage)}
            totalItems={totalCount}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            loading={loading}
          />
        )}
      </Card>

      {showForm && (
        <IntelligentProjectForm
          project={null}
          onSubmit={handleCreateProject}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingProject && (
        <IntelligentProjectForm
          project={editingProject}
          onSubmit={(data: Partial<Project>) => handleUpdateProject(editingProject.id, data)}
          onCancel={() => setEditingProject(null)}
        />
      )}
      
      {viewingProject && (
        <ProjectDetailsPanel
          project={viewingProject}
          onClose={() => setViewingProject(null)}
        />
      )}
    </div>
  )
}
