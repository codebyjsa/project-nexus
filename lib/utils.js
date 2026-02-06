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

/**
 * Get vibe style (icon and color) for explorer vibes
 * @param {string} vibe - Vibe tag name
 * @returns {Object} Vibe styling info
 */
export function getVibeStyle(vibe) {
    const styles = {
        'study-friendly': { icon: '📚', color: 'vibe-study', label: 'Study Friendly' },
        'date-spot': { icon: '💕', color: 'vibe-datespot', label: 'Date Spot' },
        'budget': { icon: '💰', color: 'vibe-budget', label: 'Budget' },
        'family-friendly': { icon: '👨‍👩‍👧', color: 'vibe-family', label: 'Family Friendly' },
        'traditional': { icon: '🏛️', color: 'vibe-traditional', label: 'Traditional' },
        'celebration': { icon: '🎉', color: 'vibe-celebration', label: 'Celebration' },
        'chill': { icon: '😌', color: 'vibe-chill', label: 'Chill' },
        'quiet': { icon: '🤫', color: 'vibe-quiet', label: 'Quiet' },
        'productive': { icon: '💪', color: 'vibe-productive', label: 'Productive' },
        'quick-bite': { icon: '⚡', color: 'vibe-quick', label: 'Quick Bite' },
        'local-favorite': { icon: '⭐', color: 'vibe-local', label: 'Local Favorite' },
        'peaceful': { icon: '🕊️', color: 'vibe-peaceful', label: 'Peaceful' },
        'nature': { icon: '🌿', color: 'vibe-nature', label: 'Nature' },
        'photography': { icon: '📸', color: 'vibe-photo', label: 'Photography' },
        'fun': { icon: '🎮', color: 'vibe-fun', label: 'Fun' },
        'group-hangout': { icon: '👥', color: 'vibe-group', label: 'Group Hangout' },
        'gaming': { icon: '🕹️', color: 'vibe-gaming', label: 'Gaming' },
        'scenic': { icon: '🌅', color: 'vibe-scenic', label: 'Scenic' },
        'convenient': { icon: '✅', color: 'vibe-convenient', label: 'Convenient' },
        'essential': { icon: '📌', color: 'vibe-essential', label: 'Essential' },
        'late-night': { icon: '🌙', color: 'vibe-latenight', label: 'Late Night' },
        'delivery': { icon: '🛵', color: 'vibe-delivery', label: 'Delivery' },
        'comfort-food': { icon: '🍕', color: 'vibe-comfort', label: 'Comfort Food' },
        'spiritual': { icon: '🙏', color: 'vibe-spiritual', label: 'Spiritual' },
        'heritage': { icon: '🏰', color: 'vibe-heritage', label: 'Heritage' },
        'modern': { icon: '✨', color: 'vibe-modern', label: 'Modern' },
        'wifi': { icon: '📶', color: 'vibe-wifi', label: 'Free WiFi' },
        'street-food': { icon: '🥡', color: 'vibe-street', label: 'Street Food' },
        'entertainment': { icon: '🎬', color: 'vibe-entertainment', label: 'Entertainment' },
        'weekend': { icon: '📅', color: 'vibe-weekend', label: 'Weekend' },
        'fitness': { icon: '🏋️', color: 'vibe-fitness', label: 'Fitness' },
        'health': { icon: '❤️', color: 'vibe-health', label: 'Health' },
        'motivated': { icon: '🔥', color: 'vibe-motivated', label: 'Motivated' },
        'academic': { icon: '🎓', color: 'vibe-academic', label: 'Academic' },
        'bookworm': { icon: '📖', color: 'vibe-bookworm', label: 'Bookworm' },
    };
    return styles[vibe.toLowerCase()] || { icon: '🏷️', color: 'vibe-default', label: vibe };
}

/**
 * Get category icon and color for explorer categories
 * @param {string} category - Category name
 * @returns {Object} Category styling info
 */
export function getExploreCategoryStyle(category) {
    const styles = {
        food: { icon: '🍽️', color: 'cat-food', label: 'Food' },
        cafe: { icon: '☕', color: 'cat-cafe', label: 'Cafés' },
        nature: { icon: '🌿', color: 'cat-nature', label: 'Nature' },
        entertainment: { icon: '🎮', color: 'cat-entertainment', label: 'Entertainment' },
        shopping: { icon: '🛍️', color: 'cat-shopping', label: 'Shopping' },
        spiritual: { icon: '🙏', color: 'cat-spiritual', label: 'Spiritual' },
        fitness: { icon: '💪', color: 'cat-fitness', label: 'Fitness' },
    };
    return styles[category] || { icon: '📍', color: 'cat-default', label: category };
}

/**
 * Check if a place is currently open
 * @param {Object} operatingHours - Operating hours object
 * @returns {Object} Open status with message
 */
export function getOpenStatus(operatingHours) {
    if (!operatingHours) return { isOpen: false, message: 'Hours unknown' };

    const now = new Date();
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const day = days[now.getDay()];
    const currentTime = now.toTimeString().slice(0, 5);

    const hours = operatingHours[day];
    if (!hours) return { isOpen: false, message: 'Closed today' };

    // Handle 24-hour places
    if (hours.open === '00:00' && hours.close === '23:59') {
        return { isOpen: true, message: 'Open 24 hours' };
    }

    const isOpen = currentTime >= hours.open && currentTime <= hours.close;

    if (isOpen) {
        return { isOpen: true, message: `Open until ${hours.close}` };
    } else if (currentTime < hours.open) {
        return { isOpen: false, message: `Opens at ${hours.open}` };
    } else {
        return { isOpen: false, message: `Closed · Opens ${hours.open}` };
    }
}

/**
 * Format rating as star display
 * @param {number} rating - Rating value (0-5)
 * @returns {string} Star string representation
 */
export function formatRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
    return '★'.repeat(fullStars) + (hasHalf ? '½' : '') + '☆'.repeat(emptyStars);
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 * @param {number} lat1 - Latitude 1
 * @param {number} lng1 - Longitude 1
 * @param {number} lat2 - Latitude 2
 * @param {number} lng2 - Longitude 2
 * @returns {number} Distance in kilometers
 */
export function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
}

/**
 * Format distance with walking/driving time estimate
 * @param {number} distance - Distance in km
 * @returns {Object} Formatted distance with time estimates
 */
export function formatDistance(distance) {
    if (!distance) return { text: 'Distance unknown', walkTime: null, driveTime: null };

    const walkingSpeed = 5; // km/h
    const drivingSpeed = 30; // km/h in city

    const walkMins = Math.round((distance / walkingSpeed) * 60);
    const driveMins = Math.round((distance / drivingSpeed) * 60);

    return {
        text: distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance} km`,
        walkTime: walkMins > 60 ? `${Math.floor(walkMins / 60)}h ${walkMins % 60}m` : `${walkMins} min walk`,
        driveTime: `${driveMins} min drive`,
    };
}
