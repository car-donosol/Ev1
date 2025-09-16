export async function getSession(supabase) {
    const accessTokenData = JSON.parse(localStorage.getItem('access-token'));
    const refreshToken = localStorage.getItem('refresh-token');

    if (!refreshToken) {
        window.location.href = '../../login.html';
        return null;
    }

    let session = null;

    try {
        if (accessTokenData && Date.now() < accessTokenData.expiresAt) {
            console.log('Usando access_token válido desde localStorage');
            session = {
                access_token: accessTokenData.token,
                refresh_token: refreshToken,
            };
        } else {
            console.log('Access_token no válido o inexistente. Intentando refrescar...');
            const { data, error } = await supabase.auth.refreshSession({
                refresh_token: refreshToken,
            });

            if (error) {
                localStorage.removeItem('access-token');
                localStorage.removeItem('refresh-token');
                window.location.href = '../../login.html';
            };

            session = data.session;

            console.log('Sesión refrescada:', session);
            
            localStorage.setItem('access-token', JSON.stringify({
                token: session.access_token,
                expiresAt: Date.now() + (session.expires_in * 1000)
            }));
            
            localStorage.setItem('refresh-token', session.refresh_token);

            console.log('Sesión refrescada exitosamente');
        }

        return session;
        
    } catch (error) {
        console.error('Error en la sesión:', error.message);
        return null;
    }
}
