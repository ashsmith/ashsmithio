import { useEffect, useState } from 'react'
import Head from 'next/head'
// import Bio from '../components/Bio'
import BlogPostItem from '../components/BlogPostItem'
import styled from 'styled-components';
import ProfilePic from '../components/ProfilePic'
import {styleScheme, calcSize} from '../config';
import { fetchBlogPosts } from '../lib/contentful';

const HeaderTitleWrapper = styled.div``;

const JobTitle = styled.h2`
font-weight: normal;
color: ${styleScheme.secondaryColor};
`;

const HeaderTitle = styled.h1`

font-size: ${calcSize(32)};

@media (min-width: 700px) {
  font-size: ${calcSize(40)};
}
font-weight: 600;
letter-spacing: -0.5;
line-height: 1.25;
margin: 0 0 0.3em 0;
`

const HomepageHeaderWrapper = styled.div`
text-align: center;
margin-bottom: ${calcSize(40)};
padding-bottom: ${calcSize(96)};
border-bottom: 1px solid ${styleScheme.borderColor};

@media (min-width: 700px) {
  text-align: inherit;
  display: grid;
  grid-template-columns: ${calcSize(120)} 1fr;
  grid-column-gap: ${calcSize(32)};
  padding-top: 0;
  padding-left: ${calcSize(64)};
  padding-right: ${calcSize(64)};
}
`


const PostWrapper = styled.div`
@media (min-width: 700px) {
  display: grid;
  grid-auto-rows: 1fr;
}
`

function HomePage({ posts }) {
  if (!posts) {
    return <p>Loading</p>
  }

  return (
    <>
      <Head>
        <title>Next.js + Contentful</title>
        {/* <meta name="description" content={siteDescription} /> */}
      </Head>

      <HomepageHeaderWrapper>
        <ProfilePic />
        <HeaderTitleWrapper>
        <HeaderTitle>I’m Ash! A Magento Developer  and keen triathlete.</HeaderTitle>
        <JobTitle>Magento Developer @ Play Sports Network</JobTitle>
        </HeaderTitleWrapper>
      </HomepageHeaderWrapper>


      <PostWrapper>
        {posts.map(({ fields }) => {
          return (<BlogPostItem key={fields.permalink}
            slug={fields.permalink}
            title={fields?.title || fields.permalink}
            date={fields.date} category={fields.category} />)
        })}
      </PostWrapper>
    </>
  )
}

export async function getStaticProps({ preview }) {
  const posts = await fetchBlogPosts(preview);
  return {
    props: {
      preview: preview ?? false,
      posts: posts ?? []
    }
  }
}

export default HomePage
