import React from 'react'
import styled from 'styled-components'
import numToWords from '../../utils/numberToWord'
import ProfilePic from '../ProfilePic'
import { calcSize } from '../../config';

const BioWrapper = styled.div`
  border-radius: ${calcSize(8)};
  margin-bottom: ${calcSize(64)};
  text-align:center;

  @media (min-width: 700px) {
    text-align:inherit;
    box-shadow: 0 5px 15px -1px rgba(0,0,0,0.20);
    display: grid;
    grid-template-columns: ${calcSize(120)} 1fr;
    grid-column-gap: ${calcSize(32)};
    padding: ${calcSize(48)} ${calcSize(64)};
  }
`;

const Intro = styled.div`
  align-self: center;
  p:last-child {
    margin: 0;
  }
`;

var experience = (new Date()).getFullYear() - 2010;

class Bio extends React.Component {

  render() {
    return (
      <BioWrapper>
        <ProfilePic />
        <Intro>
          <p>I'm Ash, a <strong>eCommerce Enginer @ Play Sports Network</strong>, keen cyclist and aspiring triathlete.
          With over {numToWords(experience)} years Magento experience.</p>

          <p><a href="mailto:hello@ashsmith.io">Need a hand with something? Contact me</a></p>
        </Intro>
      </BioWrapper>
    )
  }
}

export default Bio
