import React, { FC } from 'react';
import Link from 'next/link';
import { Grid, Text } from '@geist-ui/react';
import Github from '@geist-ui/react-icons/github';
import Twitter from '@geist-ui/react-icons/twitter';
import Instagram from '@geist-ui/react-icons/instagram';
import LinkedIn from '@geist-ui/react-icons/linkedin';

const Header: FC = () => (
  <Grid.Container justify="space-between" style={{ marginTop: '.5rem' }}>
    <Grid xs={12}>
      <Text b size="1.5rem">
        <Link href="/"><a>Ash Smith</a></Link>
      </Text>
    </Grid>
    <Grid xs={12}>
      <Grid.Container gap={2} justify="flex-end">
        <Grid>
          <a href="https://twitter.com/ashsmithco" rel="nofollow noopener">
            <Twitter />
          </a>
        </Grid>
        <Grid>
          <a href="https://github.com/ashsmith" rel="nofollow noopener">
            <Github />
          </a>
        </Grid>
        <Grid>
          <a href="https://instagram.com/ashsmithtri" rel="nofollow noopener">
            <Instagram />
          </a>
        </Grid>
        <Grid>
          <a href="https://www.linkedin.com/in/ashsmithco/" rel="nofollow noopener">
            <LinkedIn />
          </a>
        </Grid>
      </Grid.Container>
    </Grid>
  </Grid.Container>
);

export default Header;
