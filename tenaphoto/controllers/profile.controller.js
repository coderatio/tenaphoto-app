exports.index = (request, response) => {
    const { user } = request

    return response.status(200).json({
        state: 'success',
        message: 'Profile retrieved',
        data: {
            uid: user.user_id,
            displayName: user.name,
            email: user.email,
            emailVerified: user.email_verified,
            loginExpiresAt: user.exp,
        }
    })
}