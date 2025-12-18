import { TaskScope, TaskStatus, TaskPriority } from './types';

export default interface Task {
    id: string;
    scope: TaskScope;
    apiary_id: string;
    hive_id?: string;
    title: string;
    description?: string;
    due_date?: string;
    status: TaskStatus;
    priority: TaskPriority;
    assigned_user_id?: string;
    created_at: string;
    updated_at: string;
    completed_at?: string;
}
