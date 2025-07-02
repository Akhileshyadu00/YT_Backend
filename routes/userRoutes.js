import {register, login} from '../controllers/userController.js'

export function UserRoutes(app) {
    app.post('/api/register', register)
    app.post('/api/login', login)
}