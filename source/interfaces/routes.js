class Router {
    initializeAPI() {
        const HttpServerAdapter = require('../adapters/httpServer-adapter')
        const httpServer = new HttpServerAdapter()

        const DesativateAccount = require('./routes/admins-routes/desativateAccount.route')
        const InsertAdmin = require('./routes/admins-routes/insertAdmin.route')
        const InsertQuestion = require('./routes/admins-routes/insertQuestions.route')
        const ListAccounts = require('./routes/admins-routes/listAccounts.route')
        const ReativateAccount = require('./routes/admins-routes/reativateAccount.route')
        const ListQuestions = require('./routes/admins-routes/listQuestions.route')
        const RemoveAdmin = require('./routes/admins-routes/removeAdmin.route')
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
        const RecoverPassword = require('./routes/mailer-routes/recoverPassword.route')
        const ListQuestionsTest = require('./routes/questions-routes/listQuestions.route')
        const ValidateAnswer = require('./routes/questions-routes/validateAnswers.route')

        const desativateAccount = new DesativateAccount()
        const insertAdmin = new InsertAdmin()
        const insertQuestion = new InsertQuestion()
        const listAccounts = new ListAccounts()
        const reativateAccount = new ReativateAccount()
        const listQuestions = new ListQuestions()
        const removeAdmin = new RemoveAdmin()
        const removeQuestion = new RemoveQuestion()
        const updateQuestion = new UpdateQuestion()
        const viewQuestion = new ViewQuestion()
        const changePassword = new ChangePassword()
        const login = new Login()
        const register = new Register()
        const validateAdmin = new ValidateAdmin()
        const validateAdminToken = new ValidateAdminToken()
        const validateToken = new ValidateToken()
        const cardsDashboard = new CardsDashboard()
        const dashboardTop = new DashboardTop()
        const dashboardBottom = new DashboardBottom()
        const dashboardHome = new DashboardHome()
        const contact = new Contact()
        const recoverPassword = new RecoverPassword()
        const listQuestionsTest = new ListQuestionsTest()
        const validateAnswer = new ValidateAnswer()

        httpServer.get('/admin/desativate_account', desativateAccount.route)
        httpServer.get('/admin/insert_admin', insertAdmin.route)
        httpServer.get('/admin/insert_question', insertQuestion.route)
        httpServer.get('/admin/list_accounts', listAccounts.route)
        httpServer.get('/admin/reativate_account', reativateAccount.route)
        httpServer.get('/admin/list_questions', listQuestions.route)
        httpServer.get('/admin/remove_admin', removeAdmin.route)
        httpServer.get('/admin/remove_question', removeQuestion.route)
        httpServer.get('/admin/update_question', updateQuestion.route)
        httpServer.get('/admin/view_question', viewQuestion.route)

        httpServer.get('/authentication/change_password', changePassword.route)
        httpServer.get('/authentication/login', login.route)
        httpServer.get('/authentication/register', register.route)
        httpServer.get('/authentication/validate_admin', validateAdmin.route)
        httpServer.get('/authentication/validate_admin_token', validateAdminToken.route)
        httpServer.get('/authentication/validate_token', validateToken.route)

        httpServer.get('/dashboard/cards_dashboard', cardsDashboard.route)
        httpServer.get('/dashboard/dashboard_top', dashboardTop.route)
        httpServer.get('/dashboard/dashboard_bottom', dashboardBottom.route)
        httpServer.get('/dashboard/dashboard_home', dashboardHome.route)

        httpServer.get('/mailer/contact', contact.route)
        httpServer.get('/mailer/recover_password', recoverPassword.route)

        httpServer.get('/questions/list_questions_test', listQuestionsTest.route)
        httpServer.get('/questions/validate_answer', validateAnswer.route)
    
        httpServer.start()
    }

}

module.exports = Router