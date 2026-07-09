import express from 'express';
import indexHandler from './api/categories/index.js';
import slugOrIdHandler from './api/categories/[slugOrId].js';
import loginHandler from './api/auth/login.js';
import customerProfileHandler from './api/customer/profile.js';
import contractorProfileHandler from './api/contractor/profile.js';
import providersIndexHandler from './api/providers/index.js';
import providersProfileHandler from './api/providers/profile.js';
import providersDetailHandler from './api/providers/[id]/index.js';
import providersVerifyHandler from './api/providers/[id]/verify.js';
import providersFeatureHandler from './api/providers/[id]/feature.js';
import providersStatusHandler from './api/providers/[id]/status.js';
import requirementsIndexHandler from './api/requirements/index.js';
import requirementsMyHandler from './api/requirements/my.js';
import requirementsDetailHandler from './api/requirements/[id].js';
import bookingsIndexHandler from './api/bookings/index.js';
import bookingsMyHandler from './api/bookings/my.js';
import bookingsDetailHandler from './api/bookings/[id]/index.js';
import bookingsCancelHandler from './api/bookings/[id]/cancel.js';
import providerBookingsIndexHandler from './api/provider/bookings/index.js';
import providerBookingsAcceptHandler from './api/provider/bookings/[id]/accept.js';
import providerBookingsRejectHandler from './api/provider/bookings/[id]/reject.js';
import providerBookingsStartHandler from './api/provider/bookings/[id]/start.js';
import providerBookingsCompleteHandler from './api/provider/bookings/[id]/complete.js';
import adminBookingsIndexHandler from './api/admin/bookings/index.js';
import adminBookingsUpdateHandler from './api/admin/bookings/[id].js';
import subscriptionsPlansHandler from './api/subscriptions/plans.js';
import subscriptionsMyHandler from './api/subscriptions/my.js';
import subscriptionsActivateHandler from './api/subscriptions/activate.js';
import subscriptionsCancelHandler from './api/subscriptions/cancel.js';
import adminPlansIndexHandler from './api/admin/subscriptions/plans/index.js';
import adminPlansDetailHandler from './api/admin/subscriptions/plans/[id].js';

// Consultation Handler Imports
import consultationsIndexHandler from './api/consultations/index.js';
import consultationsDetailHandler from './api/consultations/[id]/index.js';
import consultationsCancelHandler from './api/consultations/[id]/cancel.js';
import providerConsultationsIndexHandler from './api/provider/consultations/index.js';
import providerConsultationsAcceptHandler from './api/provider/consultations/[id]/accept.js';
import providerConsultationsRejectHandler from './api/provider/consultations/[id]/reject.js';
import providerConsultationsRescheduleHandler from './api/provider/consultations/[id]/reschedule.js';
import providerConsultationsCompleteHandler from './api/provider/consultations/[id]/complete.js';
import providerAvailabilityHandler from './api/provider/availability.js';
import adminConsultationsIndexHandler from './api/admin/consultations/index.js';
import adminConsultationsDetailHandler from './api/admin/consultations/[id].js';

// Callback Handler Imports
import publicCallbacksIndexHandler from './api/callbacks/index.js';
import publicCallbacksStatusHandler from './api/callbacks/status.js';
import adminCallbacksIndexHandler from './api/admin/callbacks/index.js';
import adminCallbacksDetailHandler from './api/admin/callbacks/[id]/index.js';
import adminCallbacksAssignHandler from './api/admin/callbacks/[id]/assign.js';
import adminCallbacksStatusHandler from './api/admin/callbacks/[id]/status.js';
import adminCallbacksNotesHandler from './api/admin/callbacks/[id]/notes.js';
import adminCallbacksAnalyticsHandler from './api/admin/callbacks/analytics.js';
import providerCallbacksIndexHandler from './api/provider/callbacks/index.js';
import providerCallbacksContactedHandler from './api/provider/callbacks/[id]/contacted.js';
import providerCallbacksConsultationBookedHandler from './api/provider/callbacks/[id]/consultation-booked.js';
import providerCallbacksServiceBookedHandler from './api/provider/callbacks/[id]/service-booked.js';

const app = express();
app.use(express.json());

// Request adapter to map Express requests and responses to Vercel format
const adapt = (handler) => async (req, res) => {
  Object.assign(req.query, req.params);
  try {
    await handler(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

app.get('/api/categories', adapt(indexHandler));
app.post('/api/categories', adapt(indexHandler));
app.get('/api/categories/:slugOrId', adapt(slugOrIdHandler));
app.put('/api/categories/:slugOrId', adapt(slugOrIdHandler));
app.delete('/api/categories/:slugOrId', adapt(slugOrIdHandler));
app.post('/api/auth/login', adapt(loginHandler));
app.get('/api/customer/profile', adapt(customerProfileHandler));
app.post('/api/customer/profile', adapt(customerProfileHandler));
app.put('/api/customer/profile', adapt(customerProfileHandler));
app.get('/api/contractor/profile', adapt(contractorProfileHandler));
app.post('/api/contractor/profile', adapt(contractorProfileHandler));
app.put('/api/contractor/profile', adapt(contractorProfileHandler));
app.get('/api/providers', adapt(providersIndexHandler));
app.get('/api/providers/profile', adapt(providersProfileHandler));
app.post('/api/providers/profile', adapt(providersProfileHandler));
app.put('/api/providers/profile', adapt(providersProfileHandler));
app.get('/api/providers/:id', adapt(providersDetailHandler));
app.patch('/api/providers/:id/verify', adapt(providersVerifyHandler));
app.patch('/api/providers/:id/feature', adapt(providersFeatureHandler));
app.patch('/api/providers/:id/status', adapt(providersStatusHandler));
app.post('/api/requirements', adapt(requirementsIndexHandler));
app.get('/api/requirements/my', adapt(requirementsMyHandler));
app.get('/api/requirements/:id', adapt(requirementsDetailHandler));

// Booking Routes
app.post('/api/bookings', adapt(bookingsIndexHandler));
app.get('/api/bookings/my', adapt(bookingsMyHandler));
app.get('/api/bookings/:id', adapt(bookingsDetailHandler));
app.patch('/api/bookings/:id/cancel', adapt(bookingsCancelHandler));

app.get('/api/provider/bookings', adapt(providerBookingsIndexHandler));
app.patch('/api/provider/bookings/:id/accept', adapt(providerBookingsAcceptHandler));
app.patch('/api/provider/bookings/:id/reject', adapt(providerBookingsRejectHandler));
app.patch('/api/provider/bookings/:id/start', adapt(providerBookingsStartHandler));
app.patch('/api/provider/bookings/:id/complete', adapt(providerBookingsCompleteHandler));

app.get('/api/admin/bookings', adapt(adminBookingsIndexHandler));
app.patch('/api/admin/bookings/:id', adapt(adminBookingsUpdateHandler));

// Subscription Routes
app.get('/api/subscriptions/plans', adapt(subscriptionsPlansHandler));
app.get('/api/subscriptions/my', adapt(subscriptionsMyHandler));
app.post('/api/subscriptions/activate', adapt(subscriptionsActivateHandler));
app.post('/api/subscriptions/cancel', adapt(subscriptionsCancelHandler));

app.post('/api/admin/subscriptions/plans', adapt(adminPlansIndexHandler));
app.put('/api/admin/subscriptions/plans/:id', adapt(adminPlansDetailHandler));
app.delete('/api/admin/subscriptions/plans/:id', adapt(adminPlansDetailHandler));

// Consultation Routes
app.post('/api/consultations', adapt(consultationsIndexHandler));
app.get('/api/consultations/my', adapt(consultationsIndexHandler));
app.get('/api/consultations/:id', adapt(consultationsDetailHandler));
app.patch('/api/consultations/:id/cancel', adapt(consultationsCancelHandler));

app.get('/api/provider/consultations', adapt(providerConsultationsIndexHandler));
app.patch('/api/provider/consultations/:id/accept', adapt(providerConsultationsAcceptHandler));
app.patch('/api/provider/consultations/:id/reject', adapt(providerConsultationsRejectHandler));
app.patch('/api/provider/consultations/:id/reschedule', adapt(providerConsultationsRescheduleHandler));
app.patch('/api/provider/consultations/:id/complete', adapt(providerConsultationsCompleteHandler));

app.get('/api/provider/availability', adapt(providerAvailabilityHandler));
app.put('/api/provider/availability', adapt(providerAvailabilityHandler));

app.get('/api/admin/consultations', adapt(adminConsultationsIndexHandler));
app.patch('/api/admin/consultations/:id', adapt(adminConsultationsDetailHandler));

// Callback Request Routes
app.post('/api/callbacks', adapt(publicCallbacksIndexHandler));
app.get('/api/callbacks/status', adapt(publicCallbacksStatusHandler));

app.get('/api/admin/callbacks', adapt(adminCallbacksIndexHandler));
app.get('/api/admin/callbacks/analytics', adapt(adminCallbacksAnalyticsHandler));
app.get('/api/admin/callbacks/:id', adapt(adminCallbacksDetailHandler));
app.patch('/api/admin/callbacks/:id/assign', adapt(adminCallbacksAssignHandler));
app.patch('/api/admin/callbacks/:id/status', adapt(adminCallbacksStatusHandler));
app.patch('/api/admin/callbacks/:id/notes', adapt(adminCallbacksNotesHandler));

app.get('/api/provider/callbacks', adapt(providerCallbacksIndexHandler));
app.patch('/api/provider/callbacks/:id/contacted', adapt(providerCallbacksContactedHandler));
app.patch('/api/provider/callbacks/:id/consultation-booked', adapt(providerCallbacksConsultationBookedHandler));
app.patch('/api/provider/callbacks/:id/service-booked', adapt(providerCallbacksServiceBookedHandler));

const port = 3000;
app.listen(port, () => {
  console.log(`\n======================================================`);
  console.log(`  Local Serverless API Gateway: http://localhost:${port}`);
  console.log(`======================================================\n`);
});
