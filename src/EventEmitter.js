export class EventEmitter {
  // 登録する [イベント名, Set(リスナー関数)] を管理するMap
  #listeners = new Map();
  /**
   * 指定したイベントが実行されたときに呼び出されるリスナー関数を登録する
   * @param {string} type イベント名
   * @param {Function} listener イベントリスナー
   */
  addEventListener(type, listener) {
    // 指定したイベントに対応するSetを作成しリスナー関数を登録する
    // イベント名が無ければ[イベント名, 空のSet]の配列をMapに追加する
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
    // Setがなければ終了
    if (!listenerSet) {
      return;
    }
    // this(EventEmitterインスタンス)を指定してすべてのリスナーを実行する
    listenerSet.forEach(listener => {
      // thisを指定しない(listener();)と、thisが undefined(strictモード)、またはwindow/global(非strictモード)になる
      listener.call(this);
    });
  }

  /**
   * 指定したイベントのイベントリスナーを解除する
   * @param {string} type イベント名
   * @param {Function} listener イベントリスナー
   */
  removeEventListener(type, listener) {
    // 指定したイベントに対応するSetを取り出し、該当するリスナー関数を削除する
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
