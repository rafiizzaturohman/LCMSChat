import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
    private users = [
        {
            'id': 1,
            'name': 'Rafi Izzaturohman',
            'email': 'rafiizzaturohman@gmail.com',
            'role': 'LECTURER',
        },
        {
            'id': 2,
            'name': 'Alya Putri Maharani',
            'email': 'alyaapm@gmail.com',
            'role': 'ADMIN',
        },
        {
            'id': 3,
            'name': 'M Fadhil Noor Ikhsan',
            'email': 'dhildii@gmail.com',
            'role': 'STUDENT',
        },
        {
            'id': 4,
            'name': 'Adzima Hafidz K',
            'email': 'jim@gmail.com',
            'role': 'STUDENT',
        },
        {
            'id': 5,
            'name': 'Qeysha Yudilla',
            'email': 'qeyu@gmail.com',
            'role': 'STUDENT',
        },
    ]

    findAll(role?: 'ADMIN' | 'LECTURER' | 'STUDENT') {
        if (role) {
            return this.users.filter(user => user.role === role)
        }
        return this.users
    }

    findOne(id: number) {
        const user = this.users.find(user => user.id === id)

        return user
    }

    create(user: {name: string, email: string, role: 'ADMIN' | 'LECTURER' | 'STUDENT'}) {
        const usersByHighestId = [...this.users].sort((a, b) => b.id - a.id)

        const newUser = {
            id: usersByHighestId[0].id + 1,
            ...user
        }

        this.users.push(newUser)
        return newUser
    }

    update(id: number, updatedUser: {name?: string, email?: string, role?: 'ADMIN' | 'LECTURER' | 'STUDENT'}) {
        this.users = this.users.map(user => {
            if (user.id === id) {
                return { ...user, ...updatedUser };
            }
            return user
        });

        return this.findOne(id)
    }

    delete(id: number) {
        const removeUser = this.findOne(id)

        this.users = this.users.filter(user => user.id !== id)
        
        return "Data deleted successfully"
    }
}
