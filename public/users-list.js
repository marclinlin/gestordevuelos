const socket = io.connect('http://localhost:3000/');

const monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

socket.emit('get_users')
socket.on('users_list', input => {
})

const users = [
    {
        name: 'Marcos Lin',
        role: 'admin',
        email: 'linlin.marcos@gmail.com',
        lastConnection: new Date()
    },
    {
        name: 'David Verdeguer',
        role: 'instructor',
        email: 'david.verdeguer.ruiz@gmail.com',
        lastConnection: new Date()
    },
    {
        name: 'Ahmed al-Kindi',
        role: 'student',
        email: 'ahmedtest@gmail.com',
        lastConnection: new Date()
    },
    {
        name: 'Marcos Lin',
        role: 'admin',
        email: 'linlin.marcos@gmail.com',
        lastConnection: new Date()
    },
    {
        name: 'David Verdeguer',
        role: 'instructor',
        email: 'david.verdeguer.ruiz@gmail.com',
        lastConnection: new Date()
    },
    {
        name: 'Ahmed al-Kindi',
        role: 'student',
        email: 'ahmedtest@gmail.com',
        lastConnection: new Date()
    },
    {
        name: 'Marcos Lin',
        role: 'admin',
        email: 'linlin.marcos@gmail.com',
        lastConnection: new Date()
    },
    {
        name: 'David Verdeguer',
        role: 'instructor',
        email: 'david.verdeguer.ruiz@gmail.com',
        lastConnection: new Date()
    },
    {
        name: 'Ahmed al-Kindi',
        role: 'student',
        email: 'ahmedtest@gmail.com',
        lastConnection: new Date()
    },
    {
        name: 'Marcos Lin',
        role: 'admin',
        email: 'linlin.marcos@gmail.com',
        lastConnection: new Date()
    },
    {
        name: 'David Verdeguer',
        role: 'instructor',
        email: 'david.verdeguer.ruiz@gmail.com',
        lastConnection: new Date()
    },
    {
        name: 'Ahmed al-Kindi',
        role: 'student',
        email: 'ahmedtest@gmail.com',
        lastConnection: new Date()
    },
    {
        name: 'Marcos Lin',
        role: 'admin',
        email: 'linlin.marcos@gmail.com',
        lastConnection: new Date()
    },
    {
        name: 'David Verdeguer',
        role: 'instructor',
        email: 'david.verdeguer.ruiz@gmail.com',
        lastConnection: new Date()
    },
    {
        name: 'Ahmed al-Kindi',
        role: 'student',
        email: 'ahmedtest@gmail.com',
        lastConnection: new Date()
    },
    {
        name: 'Marcos Lin',
        role: 'admin',
        email: 'linlin.marcos@gmail.com',
        lastConnection: new Date()
    },
    {
        name: 'David Verdeguer',
        role: 'instructor',
        email: 'david.verdeguer.ruiz@gmail.com',
        lastConnection: new Date()
    },
    {
        name: 'Ahmed al-Kindi',
        role: 'student',
        email: 'ahmedtest@gmail.com',
        lastConnection: new Date()
    },
    {
        name: 'Marcos Lin',
        role: 'admin',
        email: 'linlin.marcos@gmail.com',
        lastConnection: new Date()
    },
    {
        name: 'David Verdeguer',
        role: 'instructor',
        email: 'david.verdeguer.ruiz@gmail.com',
        lastConnection: new Date()
    },
    {
        name: 'Ahmed al-Kindi',
        role: 'student',
        email: 'ahmedtest@gmail.com',
        lastConnection: new Date()
    },
    {
        name: 'Marcos Lin',
        role: 'admin',
        email: 'linlin.marcos@gmail.com',
        lastConnection: new Date()
    },
    {
        name: 'David Verdeguer',
        role: 'instructor',
        email: 'david.verdeguer.ruiz@gmail.com',
        lastConnection: new Date()
    },
    {
        name: 'Ahmed al-Kindi',
        role: 'student',
        email: 'ahmedtest@gmail.com',
        lastConnection: new Date()
    },
    {
        name: 'Marcos Lin',
        role: 'admin',
        email: 'linlin.marcos@gmail.com',
        lastConnection: new Date()
    },
    {
        name: 'David Verdeguer',
        role: 'instructor',
        email: 'david.verdeguer.ruiz@gmail.com',
        lastConnection: new Date()
    },
    {
        name: 'Ahmed al-Kindi',
        role: 'student',
        email: 'ahmedtest@gmail.com',
        lastConnection: new Date()
    },
    {
        name: 'Marcos Lin',
        role: 'admin',
        email: 'linlin.marcos@gmail.com',
        lastConnection: new Date()
    },
    {
        name: 'David Verdeguer',
        role: 'instructor',
        email: 'david.verdeguer.ruiz@gmail.com',
        lastConnection: new Date()
    },
    {
        name: 'Ahmed al-Kindi',
        role: 'student',
        email: 'ahmedtest@gmail.com',
        lastConnection: new Date()
    },
    {
        name: 'Marcos Lin',
        role: 'admin',
        email: 'linlin.marcos@gmail.com',
        lastConnection: new Date()
    },
    {
        name: 'David Verdeguer',
        role: 'instructor',
        email: 'david.verdeguer.ruiz@gmail.com',
        lastConnection: new Date()
    },
    {
        name: 'Ahmed al-Kindi',
        role: 'student',
        email: 'ahmedtest@gmail.com',
        lastConnection: new Date()
    },
    {
        name: 'Marcos Lin',
        role: 'admin',
        email: 'linlin.marcos@gmail.com',
        lastConnection: new Date()
    },
    {
        name: 'David Verdeguer',
        role: 'instructor',
        email: 'david.verdeguer.ruiz@gmail.com',
        lastConnection: new Date()
    },
    {
        name: 'Ahmed al-Kindi',
        role: 'student',
        email: 'ahmedtest@gmail.com',
        lastConnection: new Date()
    }
]
function renderUsers(users) {
    const usersContainer = document.querySelector('div.users-content')
    users.forEach(user => {
        const newUser = document.createElement('div')
        newUser.classList.add('user')
        const date = `${user.lastConnection.getDate()} ${monthNamesShort[user.lastConnection.getMonth()]} ${user.lastConnection.getHours()}:${user.lastConnection.getMinutes()}`
        newUser.innerHTML = `<div class="name">${user.name}</div>
        <div class="role">${user.role}</div>
        <div class="email">${user.email}</div>
        <div class="email">${date}</div>
        <div class="manage-icons"><a href="#">Edit</a> | <a href="#">Delete</a></div>
        `;
        usersContainer.appendChild(newUser)
    });
}
renderUsers(users)