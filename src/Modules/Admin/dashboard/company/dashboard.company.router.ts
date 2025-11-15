import express from 'express';
import dashboardCompanyController from './dashboard.company.controller';
import { validateSchema } from '../../../../Middlewares/validateSchema';
import { createCompanySchema } from './validation/createCompanySchema';
const dashboardCompanyRouter = express.Router();

dashboardCompanyRouter.post(
    '/',
    validateSchema(createCompanySchema),
    dashboardCompanyController.createCompany
);
dashboardCompanyRouter.get('/', dashboardCompanyController.listAllCompanies);
dashboardCompanyRouter.get('/details/:id', dashboardCompanyController.companyDetails);
dashboardCompanyRouter.get('/inventory/:id', dashboardCompanyController.companyProductsList);

export default dashboardCompanyRouter;
