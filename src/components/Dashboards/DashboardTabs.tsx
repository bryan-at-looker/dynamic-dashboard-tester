import React from 'react';
import { Tabs, TabList, Tab, TabPanels, TabPanel, Box } from '@looker/components';
import { DashboardActionList } from './DashboardActionList';

export function DashboardTabs(props: any) {
  return (
    <Box p="large">
      <Tabs>
        <TabList>
          <Tab>Favorites</Tab>
          <Tab>Shared</Tab>
          <Tab>My Personal</Tab>
          <Tab>Other User Personal</Tab>
          <Tab>Recently Viewed</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <DashboardActionList 
              {...props}
              type="favorites"
            />
          </TabPanel>

          <TabPanel>
          <DashboardActionList 
            {...props}
            type="shared"
          />
          </TabPanel>
          <TabPanel>
          <DashboardActionList 
            {...props}
            type="my_personal"
          />
          </TabPanel>
          <TabPanel>
          <DashboardActionList 
            {...props}
            type="other_personal"
          />
          </TabPanel>
          <TabPanel>
          <DashboardActionList 
            {...props}
            type="recently_viewed"
          />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
  
}
