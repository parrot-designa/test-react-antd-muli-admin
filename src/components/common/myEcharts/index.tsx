import React, { FC } from 'react' 
import { connect } from 'react-redux'

interface Props extends ReduxProps {
  option: object;
  style?: object;
}

const MyEcharts: FC<Props> = ({ 
  storeData: { theme }
}) => {
   
  return <div></div>
}

export default connect((state) => state)(MyEcharts)
