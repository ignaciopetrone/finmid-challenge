import { ChangeEvent } from 'react';
import { useAppState } from '../../../utils/appState';
import TransactionCard from '../../atoms/transactionCard';
import './styles.scss';

const statusOptions = [
  { value: 'ALL', label: 'All' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'REVERSED', label: 'Reversed' },
] as const;

type StatusValue = (typeof statusOptions)[number]['value'];

const Dashboard = () => {
  const { transactions, pagination, resolvers, searchParameters } =
    useAppState();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault();
    const statusValue = event.target.value as unknown as StatusValue;
    resolvers.searchTransactions({ status: statusValue, offset: 0 });
  };

  const onPaginateChange = async (direction: 'prev' | 'next') => {
    resolvers.searchTransactions({
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
        <div className="dashboard__filter">
          <label htmlFor="status-select">Filter by Status:</label>
          <select
            id="status-select"
            value={searchParameters.status}
            onChange={handleChange}
          >
            {statusOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.value === 'REVERSED'}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
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
