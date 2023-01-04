class Router {
    initializeAPI() {
        const HttpServerAdapter = require('../adapters/httpServer-adapter')
        const httpServer = new HttpServerAdapter()

        const RegisterMiddleware = require("../middlerwares/RegisterMiddleware.usecase")
        const LoginRouteUseCase = require("../middlerwares/LoginMiddleware.usecase")
        const AdminLoginRouteUseCase = require("../middlerwares/AdminLoginMiddleware.usecase")
        const ChangePasswordRouteUseCase = require("../middlerwares/ChangePasswordMiddleware.usecase")

        const DesativateAccount = require('./routes/admins-routes/desativateAccount.route')
        const InsertQuestion = require('./routes/admins-routes/insertQuestions.route')
        const ListAccounts = require('./routes/admins-routes/listAccounts.route')
        const ReativateAccount = require('./routes/admins-routes/reativateAccount.route')
        const ListQuestions = require('./routes/admins-routes/listQuestions.route')
        const RemoveQuestion = require('./routes/admins-routes/removeQuestions.route')
        const UpdateQuestion = require('./routes/admins-routes/updateQuestion.route')
        const ViewQuestion = require('./routes/admins-routes/viewQuestion.route')
        const ChangePassword = require('./routes/authentication-routes/changePassword.route')
        const Login = require('./routes/authentication-routes/login.route')
        const Register = require('./routes/authentication-routes/register.route')
        const ValidateAdmin = require('./routes/authentication-routes/validateAdmin.route')
        const ValidateAdminToken = require('./routes/authentication-routes/validateAdminToken.route')
        const ValidateToken = require('./routes/authentication-routes/validateToken.route')
        const CardsDashboard = require('./routes/dashboard-routes/cardsDashboard.route')
        const DashboardTop = require('./routes/dashboard-routes/dashboardTop.route')
        const DashboardBottom = require('./routes/dashboard-routes/dashboardBottom.route')
        const DashboardHome = require('./routes/dashboard-routes/homeDashboard.route')
        const Contact = require('./routes/mailer-routes/contact.route')
        const ListQuestionsTest = require('./routes/questions-routes/listQuestions.route')
        const ValidateAnswer = require('./routes/questions-routes/validateAnswers.route')

        httpServer.post('/admin/desativate_account', DesativateAccount.route)
        httpServer.post('/admin/insert_question', InsertQuestion.route)
        httpServer.get('/admin/list_accounts', ListAccounts.route)
        httpServer.post('/admin/reativate_account', ReativateAccount.route)
        httpServer.post('/admin/list_questions', ListQuestions.route)
        httpServer.post('/admin/remove_question', RemoveQuestion.route)
        httpServer.post('/admin/update_question', UpdateQuestion.route)
        httpServer.post('/admin/view_question', ViewQuestion.route)

        httpServer.use('/authentication/change_password', ChangePasswordRouteUseCase.validate)
        httpServer.post('/authentication/change_password', ChangePassword.route)
        httpServer.use('/authentication/login', LoginRouteUseCase.validate)
        httpServer.post('/authentication/login', Login.route)
        httpServer.use('/authentication/register', RegisterMiddleware.validate)
        httpServer.post('/authentication/register', Register.route)
        httpServer.use('/authentication/validate_admin', AdminLoginRouteUseCase.validate)
        httpServer.post('/authentication/validate_admin', ValidateAdmin.route)
        httpServer.post('/authentication/validate_admin_token', ValidateAdminToken.route)
        httpServer.post('/authentication/validate_token', ValidateToken.route)

        httpServer.post('/dashboard/cards_dashboard', CardsDashboard.route)
        httpServer.post('/dashboard/dashboard_top', DashboardTop.route)
        httpServer.post('/dashboard/dashboard_bottom', DashboardBottom.route)
        httpServer.post('/dashboard/dashboard_home', DashboardHome.route)

        httpServer.post('/mailer/contact', Contact.route)

        httpServer.get('/questions/list_questions_test', ListQuestionsTest.route)
        httpServer.post('/questions/validate_answer', ValidateAnswer.route)
    
        httpServer.start()
    }

}

module.exports = Router