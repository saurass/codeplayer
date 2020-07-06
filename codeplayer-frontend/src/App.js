import React from 'react';
import { Switch, BrowserRouter, Route } from 'react-router-dom';
import NavComponent from './components/core/nav/NavComponent';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import HomeComponent from './components/home/HomeComponent';
import FooterComponent from './components/core/footer/FooterComponent';
import NotFoundComponent from './components/error/404/NotFoundComponent';
import SignInComponent from './components/auth/signin/SignInComponent/SignInComponent';
import SignUpComponent from './components/auth/signup/SignUpComponent/SignUpComponent';
import EditorComponent from './components/contest/editor/EditorComponent';
import QuestionListComponent from './components/contest/questionlist/QuestionListComponent';
import AuthRoute from './services/protectedRoutes/AuthRoute';
import LogoutComponent from './components/auth/Logout/LogoutComponent';
import ContestListComponent from './components/contest/contestlist/ContestListComponent';
import ContestCreateComponent from './components/contest/contestcreate/ContestCreateComponent';
import QuestionAddComponent from './components/contest/question/QuestionAddComponent';
import AddTestCaseComponent from './components/testcase/AddTestCaseComponent';
import RawInputComponent from './components/core/raw/RawInputComponent';
import RawOutputComponent from './components/core/raw/RawOutputComponent';
import LeaderBoardComponent from './components/leaderboard/LeaderBoardComponent';
import AdminOrSemiAdminRoute from './services/protectedRoutes/AdminOrSemiAdminRoute';
import ThankYouCompunent from './components/tankyou/ThankYouComponent';
import PaymentFailComponent from './components/paymentfail/PaymentFailComponent';

function App() {
  return (
    <BrowserRouter>
      <NavComponent></NavComponent>


      <Switch>

        <Route exact path="/">
          <HomeComponent></HomeComponent>
        </Route>

        <Route exact path="/signin">
          <SignInComponent></SignInComponent>
        </Route>

        <Route exact path="/signup">
          <SignUpComponent></SignUpComponent>
        </Route>

        <AuthRoute exact path="/contests">
          <ContestListComponent></ContestListComponent>
        </AuthRoute>

        <AdminOrSemiAdminRoute exact path="/contest/create">
          <ContestCreateComponent></ContestCreateComponent>
        </AdminOrSemiAdminRoute>

        {/* <AuthRoute path="/profile">
          <ProfileComponent></ProfileComponent>
        </AuthRoute> */}

        <AuthRoute path="/logout">
          <LogoutComponent></LogoutComponent>
        </AuthRoute>

        <AuthRoute path="/question/add/:contestId">
          <QuestionAddComponent></QuestionAddComponent>
        </AuthRoute>

        <AuthRoute path="/question/:questionId">
          <EditorComponent></EditorComponent>
        </AuthRoute>

        <AdminOrSemiAdminRoute path="/testcase/add/:questionId">
          <AddTestCaseComponent></AddTestCaseComponent>
        </AdminOrSemiAdminRoute>

        <AdminOrSemiAdminRoute exact path="/testcase/raw/input/:questionId/:testcaseId">
          <RawInputComponent></RawInputComponent>
        </AdminOrSemiAdminRoute>

        <AdminOrSemiAdminRoute exact path="/testcase/raw/output/:questionId/:testcaseId">
          <RawOutputComponent></RawOutputComponent>
        </AdminOrSemiAdminRoute>

        <Route path="/contest/:contestId">
          <QuestionListComponent></QuestionListComponent>
        </Route>

        <Route path="/leaderboard/:contestId">
          <LeaderBoardComponent></LeaderBoardComponent>
        </Route>

        <Route path="/thankyou">
          <ThankYouCompunent></ThankYouCompunent>
        </Route>

        <Route path="/paymentfail">
          <PaymentFailComponent></PaymentFailComponent>
        </Route>

        <Route>
          <NotFoundComponent></NotFoundComponent>
        </Route>

      </Switch>


      <FooterComponent></FooterComponent>
    </BrowserRouter>
  );
}

export default App;
