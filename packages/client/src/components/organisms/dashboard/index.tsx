import { useNavigate } from 'react-router-dom';
import { useAppState } from '../../../utils/appState';
import TransactionCard from '../../atoms/transactionCard';
import './styles.scss';

const Dashboard = () => {
  const { transactions, isLoading } = useAppState();
  // const navigate = useNavigate();

  return (
    <div className="dashboard">
      <div className="dashboard__filters">FILTERS HERE</div>
      <div className="dashboard__transactions"></div>
      <div className="dashboard__transactions">
        {transactions.map((transaction) => (
          <TransactionCard key={transaction.id} transaction={transaction} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
