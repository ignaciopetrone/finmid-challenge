import classNames from 'classnames';
import { Transaction } from '../../../utils/appState';
import { formatDate, formatPrice } from '../../../utils/formats';
import './styles.scss';
type TransactionCardProps = {
  transaction: Transaction;
};

const TransactionCard = ({ transaction }: TransactionCardProps) => (
  <div className="transaction" key={transaction.id}>
    <img
      className="transaction__img"
      src={transaction.merchantIconUrl}
      alt="merchantIconUrl"
    />
    <div className="transaction__container">
      <h2 className="transaction__title">{transaction.merchantName}</h2>
      <div className="transaction__date">
        <span className="transaction__label">Date:</span>
        <span className="transaction__value">
          {formatDate(transaction.transactionTime)}
        </span>
      </div>

      <div className="transaction__amount">
        <span className="transaction__label">Amount:</span>
        <span className="transaction__value">
          {formatPrice(transaction.amount, transaction.currency, 'en-US')}
        </span>
      </div>

      <div className="transaction__status">
        <span className="transaction__label">Status:</span>
        <span
          className={classNames(
            'transaction__value',
            `transaction__${transaction.status.toLowerCase()}`
          )}
        >
          {transaction.status}
        </span>
      </div>
    </div>
  </div>
);

export default TransactionCard;
