import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  LOADING_TYPES,
  Transaction,
  useAppState,
} from '../../../utils/appState';
import { wait } from '../../../utils/wait';
import LoadingSpinner from '../../atoms/loadingSpinner';
import './styles.scss';
import { formatDate, formatPrice } from '../../../utils/formats';
import classNames from 'classnames';

const TransactionDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { transactions, isLoading, setLoading, resolvers } = useAppState();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [userName, setUserName] = useState<string>();

  useEffect(() => {
    // TODO Ideally here we would hit the '/api/transactions/:id' endpoint
    setLoading(LOADING_TYPES.transactionFetch);
    if (!id) {
      return;
    }

    (async () => {
      await wait(1000);
      const selectedTransaction = await transactions.find((t) => t.id === id);

      if (selectedTransaction) {
        const userName = await resolvers.getUserName(
          selectedTransaction?.userId
        );
        setTransaction(selectedTransaction);
        if (userName) {
          setUserName(userName);
        }
      }
    })();
    setLoading(LOADING_TYPES.off);
  }, [transactions]);

  if (isLoading === LOADING_TYPES.transactionFetch || transaction === null) {
    return (
      <div className="app__body">
        <div className="app__loading-spinner">
          <LoadingSpinner />
        </div>
      </div>
    );
  } else if (!transaction) {
    return (
      <div className="loading-spinner">
        There is no transaction with that id
      </div>
    );
  }

  return (
    <ul className="transaction-details">
      <h1 className="transaction-details__title">Transaction Detail</h1>
      <img
        className="transaction-details__img"
        src={transaction.merchantIconUrl}
        alt="merchantIconUrl"
      />
      <div className="transaction-details__container">
        <h2 className="transaction-details__title">
          {transaction.merchantName}
        </h2>
        <div className="transaction-details__date">
          <span className="transaction-details__label">Date:</span>
          <span className="transaction-details__value">
            {formatDate(transaction.transactionTime)}
          </span>
        </div>

        <div className="transaction-details__amount">
          <span className="transaction-details__label">Amount:</span>
          <span className="transaction-details__value">
            {formatPrice(transaction.amount, transaction.currency, 'en-US')}
          </span>
        </div>

        <div className="transaction-details__status">
          <span className="transaction-details__label">Status:</span>
          <span
            className={classNames(
              'transaction-details__value',
              `transaction-details__${transaction.status.toLowerCase()}`
            )}
          >
            {transaction.status}
          </span>
        </div>
      </div>

      <p className="transaction-details__id">ID: {transaction.id}</p>
      {userName && <p>User Responsible: {userName}</p>}
      <p>SME ID: {transaction.smeId}</p>
      <p>Merchant Name: {transaction.merchantName}</p>
      <p>Rejection Reason: {transaction.rejectionReason}</p>
    </ul>
  );
};

export default TransactionDetails;
