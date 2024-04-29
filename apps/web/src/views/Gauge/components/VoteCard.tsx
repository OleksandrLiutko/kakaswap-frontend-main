import EBox from 'components/EBox'
import styled from 'styled-components'

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px;
  width: 100%;
`
const Title = styled.label`
  font-size: 20px;
`
const SubTitle = styled.label`
  font-size: 16px;
  color: gray;
`
const DetailBox = styled(EBox)`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px 32px;
  p {
    font-size: 13px;
    margin-top: 4px;
  }
`
const VoteTable = styled.table`
  width: 100%;
  margin-top: 32px;
  min-height: 400px;
  th {
    text-align: left;
  }
`
const VoteCard = (props) => {
  return (
    <CardContent>
      <DetailBox>
        <Title>Vote with xFLACK</Title>
        <SubTitle>
          You can only change individual gauge votes once per 10 days. Make sure to do decrease first and increase last.
        </SubTitle>

        <VoteTable>
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Weight</th>
              <th>Can Vote</th>
            </tr>
          </thead>
        </VoteTable>
      </DetailBox>
    </CardContent>
  )
}

export default VoteCard
