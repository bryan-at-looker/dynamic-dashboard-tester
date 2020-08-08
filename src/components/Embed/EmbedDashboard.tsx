import React, { useCallback, useContext } from 'react'
import { LookerEmbedSDK, LookerEmbedDashboard } from '@looker/embed-sdk'
import {
  ExtensionContext,
  ExtensionContextData,
} from '@looker/extension-sdk-react'
import styled from "styled-components"
import { useParams } from 'react-router-dom'

export const EmbedDashboard = ({ setOptions, setDashboard }: any) => {
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const { dashboard_id } = useParams();
  console.log(dashboard_id)

  const setupDashboard = (dashboard: LookerEmbedDashboard) => {
    setDashboard(dashboard)
  }

  const dashboardLoaded = (event: any) => {
    if (event?.dashboard?.options) {
      setOptions(event.dashboard.options)
    }
  }

  const embedCtrRef = useCallback(
    (el) => {
      const hostUrl = extensionContext?.extensionSDK?.lookerHostData?.hostUrl
      if (el && hostUrl) {
        el.innerHTML = ''
        LookerEmbedSDK.init(hostUrl)
        LookerEmbedSDK.createDashboardWithId(dashboard_id)
          .appendTo(el)
          .withNext()
          .on('dashboard:loaded', dashboardLoaded)
          .build()
          .connect()
          .then(setupDashboard)
          .catch((error: Error) => {
            console.error('Connection error', error)
          })
      }
    },
    [dashboard_id]
  )

  return (
    <>
      <EmbedContainer ref={embedCtrRef} />
    </>
  )
}

export const EmbedContainer = styled.div`
  width: 100%;
  height: 100vh;
  & > iframe {
    width: 100%;
    height: 100%;
  }
`