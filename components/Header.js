import React from 'react';
import Link from 'next/link';
import { Grid, Text } from '@geist-ui/react';
import Github from '@geist-ui/react-icons/github'
import Twitter from '@geist-ui/react-icons/twitter';

const Header = () => (
  <Grid.Container justify="space-between" style={{ marginTop: '.5rem' }}>
    <Grid>
      <Text h3><Link href="/"><a>Ash Smith</a></Link></Text>
    </Grid>
    <Grid>
      <Grid.Container gap={2}>
        <Grid>
          <a href={'https://twitter.com/ashsmithco'} alt="Twitter"><Twitter /></a>
        </Grid>
        <Grid>
          <a href={'https://github.com/ashsmith'} alt="Github"><Github /></a>
        </Grid>
      </Grid.Container>
    </Grid>
  </Grid.Container>
);

export default Header;
