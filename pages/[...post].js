import { useRouter } from 'next/router';
import ErrorPage from 'next/error'
import styled from 'styled-components';
import ReactMarkdown from "react-markdown";
import dynamic from 'next/dynamic';
import { fetchBlogPost, fetchBlogPosts } from '../lib/contentful';
import Head from 'next/head';

// Dynamic importing of components so they're only rendered when used!
const CodeBlock = dynamic(() => import('../components/CodeBlock'))
const ContentfulImage = dynamic(() => import('../components/ContentfulImage'))

const BlogPostContent = styled.div`
& p code {
  padding: .25rem;
  display: inline-block;
  line-height: 1;
}
`;

const PostDate = styled.p`
color: #737373;
font-size: ${14/16}rem;
margin:0;
`;

const BlogTitle = styled.h1`
  font-size: 4rem;
  line-height: 1.25em;
`;

const PostContainer = styled.div`
  margin-bottom: 4rem;
  padding-bottom: 4rem;
  border-bottom: 1px solid #F1F1F1;

  & p:last-child {
    margin: 0 0 4rem 0;
  }

  @media (min-width: 700px) {
    padding: 0 4rem;
  }
`;

const PostPage = ({post}) => {
  const router = useRouter();
  if (!router.isFallback && !post) {
    return <ErrorPage statusCode={404} />
  }

  if (!post?.title) {
    return <p>Loading</p>
  }

  return (
    <>
    <Head>
      <title>{post.title}</title>
      <meta name="description" content={post.title} />
    </Head>
      <PostContainer>
        <BlogTitle>{post.title}</BlogTitle>
        <PostDate>Posted on {post.date}</PostDate>
        <BlogPostContent>
          <ReactMarkdown source={post.content} renderers={{ code: CodeBlock, image: ContentfulImage }} />
        </BlogPostContent>
      </PostContainer>
    </>
  )
};


export async function getStaticProps({ params, preview = false }) {
  const data = await fetchBlogPost(params.post.join('/'), preview);
  return {
    props: {
      preview,
      post: {
        ...data?.fields,
      },
    },
  }
}

export async function getStaticPaths() {
  const allPosts = await fetchBlogPosts(true);
  return {
    paths: allPosts?.map(({ fields: { permalink } }) => `/${permalink}`) ?? [],
    fallback: true,
  }
}

export default PostPage;