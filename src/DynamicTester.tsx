import React, { useState } from 'react';
import { Grid } from '@looker/components';
import styled from 'styled-components'
import { EmbedDashboard } from './components/Embed/EmbedDashboard';
import { LookerEmbedDashboard } from '@looker/embed-sdk';
import { EditorSidebar } from './EditorSidebar';

export function DynamicTester() {
  const [dashboard, setDashboard] = useState<LookerEmbedDashboard>()
  const [options, setOptions] = useState<any | undefined>();

  return (
    <StyledGrid columns={2}>
        <EditorSidebar {...{options, dashboard}}/>
        <EmbedDashboard
          {...{setOptions, setDashboard}}
        />
    </StyledGrid>
  );
}

// @ts-ignore
const StyledGrid = styled(Grid)`
  grid-template-columns: 400px auto;
`