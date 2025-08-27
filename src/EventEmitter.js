export class EventEmitter {
  // 登録するイベントを管理するMap ([イベント名, Set(リスナー関数)], [イベント名, Set(リスナー関数)], ...)
  #listeners = new Map();
  /**
   * 指定したイベントが実行されたときに呼び出されるリスナー関数を登録する
   * @param {string} type イベント名
   * @param {Function} listener イベントリスナー
   */
  addEventListener(type, listener) {
    if (!this.#listeners.has(type)) {
      this.#listeners.set(type, new Set());
    }
    const listenerSet = this.#listeners.get(type);  // イベント名からSetを取得
    listenerSet.add(listener);  // Setにリスナーを登録する
  }

  /**
   * 指定したイベントをディスパッチする
   * @param {string} type イベント名
   */
  emit(type) {
    // 指定したイベントに対応するSetを取り出し、すべてのリスナー関数を呼び出す
    const listenerSet = this.#listeners.get(type);
    if (!listenerSet) {
      return;
    }
    // this(EventEmitterインスタンス)を指定してすべてのリスナーを実行する
    listenerSet.forEach(listener => {
      // thisを指定しない(listener();)と、thisが undefined(strictモード)、またはwindow/global(非strictモード)になる
      // イベントリスナー内でthisを使ったときに、イベントを発火させたEventEmitterインスタンスを指すようにするために指定する
      listener.call(this);
    });
  }

  /**
   * 指定したイベントのイベントリスナーを解除する
   * @param {string} type イベント名
   * @param {Function} listener イベントリスナー
   */
  removeEventListener(type, listener) {
    const listenerSet = this.#listeners.get(type);
    if (!listenerSet) {
      return;
    }
    listenerSet.forEach(ownListener => {
      if (ownListener === listener) {
        listenerSet.delete(listener);
      }
    });
  }
}
