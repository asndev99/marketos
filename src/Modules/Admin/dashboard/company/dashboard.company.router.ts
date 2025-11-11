import express from 'express';
import dashboardCompanyController from './dashboard.company.controller';
const dashboardCompanyRouter = express.Router();

dashboardCompanyRouter.get('/', dashboardCompanyController.listAllCompanies);
dashboardCompanyRouter.get('/details/:id', dashboardCompanyController.companyDetails);
dashboardCompanyRouter.get('/inventory/:id', dashboardCompanyController.companyProductsList);

export default dashboardCompanyRouter;
