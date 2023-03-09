import {useState, useEffect} from 'react'
import Loader from 'react-loader-spinner'
import './index.css'

const ProjectsShowcase = props => {
  const {categoriesList} = props
  const [userSelection, setUserSelection] = useState('ALL')
  const [projects, setProjects] = useState('')
  const [status, setStatus] = useState('LOADER')
  const [render, setRender] = useState(true)

  useEffect(() => {
    const getSelectedValues = async () => {
      try {
        const url = `https://apis.ccbp.in/ps/projects?category=${userSelection}`
        const options = {
          method: 'GET',
        }
        const res = await fetch(url, options)
        const data = await res.json()
        const paraseData = data.projects.map(item => ({
          id: item.id,
          imageUrl: item.image_url,
          name: item.name,
        }))
        setProjects(paraseData)
        setStatus('SUCCESS')
        console.log(paraseData)
      } catch (err) {
        console.log(err)
        setStatus('FAILURE')
      }
    }
    getSelectedValues()
  }, [userSelection, render])

  const renderOptions = item => {
    const {id, displayText} = item
    return (
      <option key={id} value={id}>
        {displayText}
      </option>
    )
  }

  const renderCall = () => {
    const value = !render
    setRender(value)
    setStatus('LOADER')
  }

  const updateSelection = e => {
    setUserSelection(e.target.value)
    setStatus('LOADER')
    console.log(userSelection)
  }

  const renderFailure = () => (
    <div className="failure-box">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-para">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" className="retry-btn" onClick={renderCall}>
        Retry
      </button>
    </div>
  )

  const renderProjects = data => {
    const {id, imageUrl, name} = data
    return (
      <li key={id} className="each-item">
        <div className="project-box">
          <img src={imageUrl} alt={name} className="project-img" />
          <p className="project-name">{name}</p>
        </div>
      </li>
    )
  }

  const renderLoader = () => (
    <div className="loader-box" data-testid="loader">
      <Loader type="ThreeDots" color="#328af2" />
    </div>
  )

  const renderSuccess = () => (
    <ul className="projects-container">
      {projects.map(item => renderProjects(item))}
    </ul>
  )

  const renderFinalOutput = () => {
    switch (status) {
      case 'SUCCESS':
        return renderSuccess()
      case 'FAILURE':
        return renderFailure()
      default:
        return renderLoader()
    }
  }

  return (
    <div className="main-container">
      <header className="header">
        <img
          src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
          alt="website logo"
          className="logo"
        />
      </header>
      <div className="body-container">
        <select onChange={updateSelection} className="selection-box">
          {categoriesList.map(item => renderOptions(item))}
        </select>
        <>{renderFinalOutput()}</>
      </div>
    </div>
  )
}

export default ProjectsShowcase
