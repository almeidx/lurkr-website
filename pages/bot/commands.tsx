import styles from '../../styles/Commands.module.css';

export default function Commands() {
  return (
    <div className={styles['container']} >
      <h1>Pepe Manager Commands</h1>

      <section className={styles['commands-container']} >
        <div>
          <h1>p!ping</h1>
          <span>Checks the bots ping to the Discord servers.</span>
          <p className={styles['aliases']} >Aliases: ping, pong</p>
          {/* <p className={styles['permissions']} ></p> */}
        </div>
        <div>
          <h1>p!help</h1>
          <span>Displays a list of available commands, or detailed information for a specified command.</span>
          <p className={styles['aliases']} >Aliases: h, commands</p>
          <p className={styles['permissions']} >Permissions: Embed Links</p>
        </div>
        <div>
          <h1>p!stats</h1>
          <span>Displays the bots information.</span>
          <p className={styles['aliases']} >Aliases: botinfo, bi</p>
          <p className={styles['permissions']} >Permissions: Embed Links</p>
        </div>
      </section>
    </div>
  );
}
