export const logout = async () => {
    try {
        const response = await fetch('http://localhost:8080/logout', {
            method: 'POST',
            credentials: 'include', // Include cookies in the request
        });

        if (response.ok) {
            // Clear any local user state or redirect to login
            window.location.href = '/login';
        } else {
            console.error('Logout failed');
        }
    } catch (error) {
        console.error('Error during logout:', error);
    }
};