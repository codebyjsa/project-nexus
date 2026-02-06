/**
 * Utility functions for Project Nexus
 */

/**
 * Merge class names conditionally
 * @param  {...string} classes - Class names to merge
 * @returns {string} Merged class names
 */
export function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export function formatDate(date, options = {}) {
    const defaultOptions = {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        ...options
    };
    return new Intl.DateTimeFormat('en-IN', defaultOptions).format(new Date(date));
}

/**
 * Format time to readable string
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted time string
 */
export function formatTime(date) {
    return new Intl.DateTimeFormat('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }).format(new Date(date));
}

/**
 * Get relative time string (e.g., "2 hours ago")
 * @param {string|Date} date - Date to compare
 * @returns {string} Relative time string
 */
export function getRelativeTime(date) {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(date);
}

/**
 * Generate a unique ID
 * @returns {string} Unique ID
 */
export function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export function truncate(text, maxLength = 100) {
    if (!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
}

/**
 * Get priority color class based on priority level
 * @param {number} priority - Priority level (1-5)
 * @returns {string} CSS class for priority color
 */
export function getPriorityColor(priority) {
    const colors = {
        1: 'priority-low',
        2: 'priority-low',
        3: 'priority-medium',
        4: 'priority-high',
        5: 'priority-urgent'
    };
    return colors[priority] || colors[3];
}

/**
 * Get category icon and color based on category
 * @param {string} category - Category name
 * @returns {Object} Category styling info
 */
export function getCategoryStyle(category) {
    const styles = {
        academic: { icon: '📚', color: 'category-academic', label: 'Academic' },
        event: { icon: '🎉', color: 'category-event', label: 'Event' },
        urgent: { icon: '🚨', color: 'category-urgent', label: 'Urgent' },
        general: { icon: '📧', color: 'category-general', label: 'General' }
    };
    return styles[category] || styles.general;
}

/**
 * Get dietary type badge style
 * @param {string} type - Dietary type (veg/non-veg/jain)
 * @returns {Object} Badge styling info
 */
export function getDietaryBadge(type) {
    const badges = {
        veg: { icon: '🟢', color: 'dietary-veg', label: 'Veg' },
        'non-veg': { icon: '🔴', color: 'dietary-nonveg', label: 'Non-Veg' },
        jain: { icon: '🟡', color: 'dietary-jain', label: 'Jain' }
    };
    return badges[type] || badges.veg;
}

/**
 * Get current meal based on time
 * @returns {string} Current meal period
 */
export function getCurrentMeal() {
    const hour = new Date().getHours();
    if (hour >= 7 && hour < 10) return 'breakfast';
    if (hour >= 12 && hour < 15) return 'lunch';
    if (hour >= 17 && hour < 18) return 'snacks';
    if (hour >= 19 && hour < 22) return 'dinner';
    return 'breakfast'; // Default
}

/**
 * Check if a date is today
 * @param {string|Date} date - Date to check
 * @returns {boolean} True if date is today
 */
export function isToday(date) {
    const today = new Date();
    const checkDate = new Date(date);
    return today.toDateString() === checkDate.toDateString();
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
export function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
