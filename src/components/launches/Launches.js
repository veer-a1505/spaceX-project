import { useEffect, useState } from 'react'
import axios from 'axios'
import _loadash, { toUpper } from 'lodash'
import './Launches.css'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { rocket } from '../../images/icons8-rocket-96.png'

const Launches = () => {
  const [allLaunches, setAllLaunches] = useState([])
  const [startIndex, setStartIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [searchValue, setSearchValue] = useState('')
  const [cuurentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchAllLaunches = async () => {
      const resposne = await axios.get('https://api.spacexdata.com/v3/launches')

      setAllLaunches(resposne.data)
    }
    fetchAllLaunches()
  }, [])

  const numOfPages = allLaunches ? Math.ceil(allLaunches.length / 10) : 0
  const pages = _loadash.range(1, numOfPages + 1)

  const pagination = (pageNo) => {
    setCurrentPage(pageNo)
    const startIndex = (pageNo - 1) * 10
    setStartIndex(startIndex)
    setPageSize(pageNo * 10)
  }

  const filterQuery = (items) => {
    if (searchValue !== '') {
      return items.filter(
        (item) => item.mission_name.toLowerCase().indexOf(searchValue) > -1
      )
    }

    return items
  }

  return (
    <section className='launch'>
      <div className='launch-title'>
        <h1>SpaceX Launches</h1>
      </div>

      <div className='launch-search'>
        <i className='fas fa-search' aria-hidden='true'></i>
        <input
          type='text'
          placeholder='Search by name'
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>

      <div className='launch-cards'>
        {filterQuery(allLaunches)
          .slice(startIndex, pageSize)
          .map((launch) => (
            <div className='launch-card' key={launch.mission_name}>
              <article>
                <div className='launch-card-top'>
                  <h1>{launch.mission_name}</h1>
                  <span>
                    {moment(launch.launch_date_utc.substring(0, 10)).format(
                      'MMM YYYY'
                    )}
                  </span>
                </div>

                <div className='launch-details'>
                  <h2>{launch.details && launch.details.substring(0, 250)}</h2>
                  <p>Launch From : {launch.launch_site.site_name_long}</p>
                </div>
              </article>
              <Link to={`/launch/${launch.flight_number}`} claaas='launch-btn'>
                <button className='btn-secondary launch-btn'>
                  Read More
                  <i className='fas fa-arrow-right'></i>
                </button>
              </Link>
            </div>
          ))}
      </div>

      <>
        <div className='pagination'>
          {pages.map((page) => (
            <a
              href
              style={page === cuurentPage ? { color: '#333' } : null}
              key={page}
              onClick={() => pagination(page)}>
              {page}
            </a>
          ))}
        </div>
      </>
    </section>
  )
}

export default Launches
