// UserClient types
export interface AdminUser {
    id: string
    nickname: string
    email: string
    role: string
    status: string
    createdAt: Date
    _count: { ownedStudies: number; ownedSessions: number }
}

export interface AdminUsersProps {
    users: AdminUser[]
    search: string
    status: string
}

// DashboardClient Types
export interface DashboardUser {
    id: string
    nickname: string
    email: string
    status: string
    createdAt: Date
}

export interface Stats {
    totalUsers: number
    activeUsers: number
    pendingStudies: number
    activeStudies: number
    totalSessions: number
    pendingReports: number
    recentUsers: DashboardUser[]
}

// SessionsClient Types
export interface AdminSession {
    id: string
    title: string
    location: string
    isOnline: boolean
    maxMembers: number
    status: string
    scheduledAt: Date
    owner: { id: string; nickname: string }
    _count: { members: number }
}

export interface AdminSessionsProps {
    sessions: AdminSession[]
    status: string
}

// StudiesClient Types
export interface AdminStudy {
    id: string
    title: string
    category: string
    status: string
    isOnline: boolean
    maxMembers: number
    createdAt: Date
    owner: { id: string; nickname: string; email: string }
    _count: { members: number }
}

export interface AdminStudiesProps {
    studies: AdminStudy[]
    status: string
}

// ReportsClient Types
export interface AdminReport {
    id: string
    reason: string
    targetType: string
    targetId: string
    status: string
    createdAt: Date
    reporter: { id: string; nickname: string; email: string }
}

export interface AdminReportsProps {
    reports: AdminReport[]
    status: string
}