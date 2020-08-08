import React, {  useEffect, useState } from 'react';
import AceEditor from 'react-ace';
import beautify from 'json-beautify';

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";
import { Flex, ButtonOutline } from '@looker/components';
import styled from 'styled-components'
import { useHistory } from 'react-router-dom';

export function EditorSidebar( {options, dashboard}: any ) {
  const [new_options, setNewOptions] = useState<string | undefined>();
  const history = useHistory();
  useEffect(()=>{
    if (options && options !== {} ) {
      resetOptions(options, false)
    }
  },[options])

  const resetOptions = (obj: any, update: boolean) => {
    // @ts-ignore
    setNewOptions(beautify({...obj}, null, 2, 100))
    if (update) {
      updateDashboard(obj)
    }
  }

  const handleChange = ( new_value: string ) => {
    setNewOptions(new_value)
  }

  const updateDashboard = (obj: any) => {
    dashboard.setOptions(obj)
  }

  if (new_options) {
    return (
      <StyledFlex flexDirection="column">
        <Flex p="small" justifyContent="space-between">
          <ButtonOutline 
            onClick={()=>{history.push('/')}}
            iconBefore="Dashboard" 
            size="xsmall"
          >Choose Dashboard</ButtonOutline>
          <ButtonOutline 
            iconBefore="CacheRefresh" 
            size="xsmall"
            onClick={()=>{resetOptions(options, true)}}
          >Reset Options</ButtonOutline>
          <ButtonOutline 
            iconBefore="CircleAdd" 
            size="xsmall"
            onClick={()=>{updateDashboard(JSON.parse(new_options));}}
          >Update Dashboard</ButtonOutline>
        </Flex>
        <AceEditor
          mode="json"
          width="100%"
          height='inherit'
          theme="github"
          onChange={handleChange}
          value={new_options}
          name="ace_tester"
          showPrintMargin={false}
        />
      </StyledFlex>
    );
  } else {
    return <></>
  }
}

const StyledFlex = styled(Flex)`
  height: 100vh;
`