import React from 'react'
import profilePic from './profile-pic.jpg'


class Bio extends React.Component {
  render() {
    return (
      <div>
        <img
          src={profilePic}
          alt={`Ash Smith`}
        />
        <p>
          Written by <strong>Ash Smith</strong> is fucking awesome yeah.{' '}
          <a href="https://twitter.com/ashsmithco">
            You should follow him on Twitter
          </a>
        </p>
      </div>
    )
  }
}

export default Bio
