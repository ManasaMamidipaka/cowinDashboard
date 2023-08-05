// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationCoverage from '../VaccinationCoverage'

import VaccinationByGender from '../VaccinationByGender'

import VaccinationByAge from '../VaccinationByAge'

import './index.css'

const values = {
  pending: 'PENDING',
  success: 'SUCCESS',
  failure: 'Failure',
  initial: 'INITIAL',
}

class CowinDashboard extends Component {
  state = {
    fetchedData: {},
    displayStatus: values.initial,
  }

  componentDidMount() {
    this.fetchedDataApi()
  }

  fetchedDataApi = async () => {
    this.setState({displayStatus: values.pending})
    const url = 'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(url)
    const data = await response.json()

    if (response.ok === true) {
      const convertData = {
        last7DaysVaccination: data.last_7_days_vaccination,
        vaccinationByAge: data.vaccination_by_age,
        vaccinationByGender: data.vaccination_by_gender,
      }
      this.setState({
        fetchedData: convertData,
        displayStatus: values.success,
      })
    } else {
      this.setState({displayStatus: values.failure})
    }
  }

  renderPieCharts = () => {
    const {fetchedData} = this.state
    const {
      last7DaysVaccination,
      vaccinationByAge,
      vaccinationByGender,
    } = fetchedData

    return (
      <>
        <VaccinationCoverage vaccinationData={last7DaysVaccination} />
        <VaccinationByGender vaccinationByGenderData={vaccinationByGender} />
        <VaccinationByAge vaccinationByAgeData={vaccinationByAge} />
      </>
    )
  }

  loadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  failureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="failure-view-image"
      />
      <h1 className="failure-view-heading">Something went wrong</h1>
    </div>
  )

  switchCaseCheck = () => {
    const {displayStatus} = this.state
    switch (displayStatus) {
      case values.success:
        return this.renderPieCharts()
      case values.pending:
        return this.loadingView()
      case values.failure:
        return this.failureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="page-container">
        <div className="page-logo-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
            className="logo"
          />
          <p className="logo-text">Co-WIN</p>
        </div>
        <h1 className="page-heading"> CoWin Vaccination in India</h1>
        <div className="charts-container">{this.switchCaseCheck()}</div>
      </div>
    )
  }
}

export default CowinDashboard
