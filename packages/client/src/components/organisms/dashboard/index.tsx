import { useAppState } from '../../../utils/appState';
import TransactionCard from '../../atoms/transactionCard';
import './styles.scss';

const Dashboard = () => {
  const { transactions, pagination, resolvers } = useAppState();
  // const navigate = useNavigate();

  const onPaginateChange = async (direction: 'prev' | 'next') => {
    resolvers.getTransactions({
      offset:
        direction === 'prev' ? pagination?.prevOffset : pagination?.nextOffset,
    });
  };

  return (
    <div className="dashboard">
      <div className="dashboard__head">
        <div className="dashboard__pagination">
          <span
            className="dashboard__previous"
            onClick={() =>
              pagination?.currentPage !== 1 && onPaginateChange('prev')
            }
          >
            {'<'}
          </span>
          <span className="dashboard__current">{pagination?.currentPage}</span>
          <span
            className="dashboard__next"
            onClick={() =>
              pagination?.currentPage !== pagination?.totalPages &&
              onPaginateChange('next')
            }
          >
            {'>'}
          </span>
        </div>
        <span className="dashboard__total">
          Total Pages: {pagination?.totalPages}
        </span>
        <div className="dashboard__filter">FILTER</div>
      </div>
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
