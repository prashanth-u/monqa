test('returns sorted list of admins at the start', () => {
    const users = [
        { name: 'testUser1', role: 'Student'},
        { name: 'testUser2', role: 'Admin'},
        { name: 'testUser3', role: 'Student'}
    ]
    const sortedUsers = [
        { name: 'testUser2', role: 'Admin'},
        { name: 'testUser1', role: 'Student'},
        { name: 'testUser3', role: 'Student'}
    ]

    expect(users.sort(a => a.role === 'Admin' ? -1 : 1))
        .toStrictEqual(sortedUsers);
})