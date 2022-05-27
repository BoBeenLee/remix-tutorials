import styles from './machines.module.css';

/* eslint-disable-next-line */
export interface MachinesProps {}

export function Machines(props: MachinesProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to Machines!</h1>
    </div>
  );
}

export default Machines;
