/**
 * Shared TypeScript type definitions for TBH Beekeeper
 * These types are used across mobile and web applications
 */

// Bar Status Types (Simplified model from prototype)
export type BarStatus =
    | 'inactive'       // Bar not in use
    | 'active'         // Active but empty
    | 'empty'          // Empty comb
    | 'brood'          // Brood (worker + drone combined)
    | 'resource'       // Honey/nectar/pollen combined
    | 'follower_board'; // Follower board position

// Alternative: Detailed status for advanced tracking
export type DetailedBarStatus = 'B' | 'D' | 'E' | 'H' | 'N' | 'P';

export interface BarState {
    position: number;
    status: BarStatus;
    detailedStatus?: DetailedBarStatus;
}

// Weather Data (embedded in snapshots, inspections, interventions)
export interface WeatherData {
    temperature?: number;      // Fahrenheit
    windSpeed?: number;        // mph
    windDirection?: string;    // e.g., "N", "NE"
    precipitation?: number;    // inches
    humidity?: number;         // percentage
    cloudCover?: number;       // percentage
    source?: 'manual' | 'api'; // how it was captured
    fetchedAt?: Date;          // when API data was retrieved
}

// Queen Status Types
export type QueenStatus =
    | 'seen'          // Queen directly observed
    | 'not_seen'      // Not observed
    | 'no_queen'      // Confirmed absence (Action required)
    | 'eggs_present'  // Fresh eggs visible
    | 'capped_brood'  // Capped brood pattern (evidence)
    | 'queen_cells'   // Queen cells present
    | 'virgin'        // Virgin queen seen
    | 'unknown';      // Not checked

export type BroodPattern = 'excellent' | 'good' | 'spotty' | 'poor';
export type Temperament = 'calm' | 'moderate' | 'defensive' | 'aggressive';
export type PopulationStrength = 'strong' | 'moderate' | 'weak';
export type StoreLevel = 'abundant' | 'adequate' | 'low' | 'none';

// Intervention Types
export type InterventionType =
    | 'feeding'
    | 'treatment'
    | 'manipulation'
    | 'pest_management'
    | 'cross_comb_fix'
    | 'requeen'
    | 'other'
    | 'honey_harvest';

// Task Types
export type TaskScope = 'hive' | 'apiary';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high';

// Weather Forecast Types
export type SuitabilityScore = 'poor' | 'fair' | 'good' | 'ideal';

// Sharing Permissions
export type SharePermission = 'read' | 'write';
