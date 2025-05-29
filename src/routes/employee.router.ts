import express from 'express';
import { loginEmployee, registerEmployee,getAllEmployees, getEmployeeById, updateEmployee, deleteEmployee, resetPasswordMailLink, resetPasswordForEmployee, resetGet } from '../controllers/employee.controller';
import authMiddleware from '../middleware/employee.middleware';



const employeeRouter = express.Router();

 /** POST Methods */

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */



/**
 *  @openapi
 *  /employee/register:
 *    post:
 *      tags: 
 *        - Employee
 *      summary : Create an Employee
 *      requestBody : 
 *        required : true
 *        content :
 *          application/json:
 *            schema: 
 *              type: object
 *              required :
 *                - employeeName
 *                - email
 *                - password
 *                - role
 *                - address
 *                - age
 *              properties : 
 *                employeeName : 
 *                  type : string
 *                email :
 *                  type : string
 *                password : 
 *                  type : string
 *                role :
 *                  type : string
 *                address : 
 *                  type: string
 *                age :
 *                  type: number
 * 
 *      responses :
 *        '201':
 *          description : Created
 *        '400' : 
 *          descrription : Bad request
 *        '404' :
 *          description : Not found    
 */
employeeRouter.post("/register", registerEmployee);


/**
 *  @openapi
 *  /employee/login:
 *    post:
 *      tags: 
 *        - Employee
 *      summary : Login an Employee
 *      requestBody : 
 *        required : true
 *        content :
 *          application/json:
 *            schema: 
 *              type: object
 *              required :
 *                - email
 *                - password
 *               
 *              properties : 
 *                email :
 *                  type : string
 *                password : 
 *                  type : string
 *               
 *      responses :
 *        '200':
 *          description : OK
 *        '400' : 
 *          descrription : Bad request
 *        '404' :
 *          description : Not found    
 */



employeeRouter.post("/login",loginEmployee);
 
/**
 *  @openapi
 *  /employee/employees:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags: 
 *        - Employee
 *      summary: Get all employees
 *      parameters:
 *        - name: page
 *          in: query
 *          description: Page number for pagination (default is 1)
 *          required: false
 *          schema:
 *            type: integer
 *            default: 1
 *        - name: limit
 *          in: query
 *          description: Number of items per page (default is 10)
 *          required: false
 *          schema:
 *            type: integer
 *            default: 10
 *        - name: sortBy
 *          in: query
 *          description: Field to sort by (e.g., employeeName)
 *          required: false
 *          schema:
 *            type: string
 *            default: employeeName
 *        - name: sortOrder
 *          in: query
 *          description: Sort order - asc or desc (default is asc)
 *          required: false
 *          schema:
 *            type: string
 *            enum: [asc, desc]
 *            default: asc
 *        - name: search
 *          in: query
 *          description: Search term to filter employees by name, role, email, or address
 *          required: false
 *          schema:
 *            type: string
 *      responses:
 *        '200':
 *          description: OK
 *        '400':
 *          description: Bad request
 *        '404':
 *          description: Not found
 */


employeeRouter.get("/employees",authMiddleware,getAllEmployees)


/**
 *  @openapi
 *  /employee/{id}:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags: 
 *        - Employee
 *      summary : Get an employee by ID
 *      parameters :
 *        - in: path
 *          name: id
 *          required : true 
 *          schema :
 *             type: string
 *                
 *      responses :
 *        '200':
 *          description : OK
 *        '400' : 
 *          descrription : Bad request
 *        '404' :
 *          description : Not found    
 */


employeeRouter.get("/:id",authMiddleware,getEmployeeById);


/**
 * @openapi
 * /employee/update/{id}:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     tags: 
 *       - Employee
 *     summary: Update an Employee by ID And Token
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 * 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employeeName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *               address:
 *                 type: string
 *               age:
 *                 type: number
 *     responses:
 *       '200':
 *         description: OK
 */

employeeRouter.patch("/update/:id",authMiddleware,updateEmployee);




/**
 *  @openapi
 *  /employee/delete/{id}:
 *    delete:
 *      security:
 *        - bearerAuth: []
 *      tags: 
 *        - Employee
 *      summary : Delete an employee by ID and Token
 *      parameters :
 *        - in: path
 *          name: id
 *          required : true 
 *          schema :
 *             type: string
 *                
 *      responses :
 *        '200':
 *          description : OK
 *        '400' : 
 *          descrription : Bad request
 *        '404' :
 *          description : Not found    
 */




employeeRouter.delete("/delete/:id",authMiddleware,deleteEmployee)

/**
 *  @openapi
 *  /employee/resetpassword-link:
 *    post:
 *      tags: 
 *        - Password reset
 *      summary : Reset Password link 
 *      requestBody : 
 *        required : true
 *        content :
 *          application/json:
 *            schema: 
 *              type: object
 *              required :
 *                - email
 * 
 *              properties : 
 *                email :
 *                  type : string
 * 
 *      responses :
 *        '200':
 *          description : OK
 *        '400' : 
 *          descrription : Bad request
 *        '404' :
 *          description : Not found    
 */



employeeRouter.post("/resetpassword-link",resetPasswordMailLink);

                                                  
/**
 * @openapi
 * /employee/password-reset/{employeeId}/{token}:
 *   post:
 *     tags: 
 *       - Password reset
 *     summary: Password Reset 
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *               confirmPassword:
 *                  type: string
 *     responses:
 *       '200':
 *         description: OK
 */
employeeRouter.post("/password-reset/:employeeId/:token",resetPasswordForEmployee)


/**
 * @openapi
 * /employee/password-reset/{employeeId}/{token}:
 *   get:
 *     tags: 
 *       - Password reset
 *     summary: Password Reset 
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: OK
 */


employeeRouter.get("/password-reset/:employeeId/:token",resetGet)

export default employeeRouter;