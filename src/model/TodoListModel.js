import { EventEmitter } from "../EventEmitter.js";

// EventEmitterクラスを継承したTodoListModelクラスを作成
export class TodoListModel extends EventEmitter {
  #items;
  #editingId = null;

  /**
   * @param {TodoItemModel[]} [items] 初期アイテム一覧（デフォルトは空の配列）
   */
  constructor(items = []) {
    super();
    this.#items = items;  // TodoListModelインスタンスの#itemsに初期アイテム一覧を格納
  }

  /**
   * TodoItemの合計個数を返す
   * @returns {number}
   */
  getTotalCount() {
    return this.#items.length;
  }

  /**
 * TodoItemの完了済みの個数を返す
 * @returns {number}
 */
  getCompletedCount() {
    const completedItems = this.#items.filter(item => item.completed === true);
    return completedItems.length;
  }

  /**
 * TodoItemの未完了の個数を返す
 * @returns {number}
 */
  getIncompletedCount() {
    return this.getTotalCount() - this.getCompletedCount();
  }

  /**
   * 表示できるTodoItemの配列を返す
   * @returns {TodoItemModel[]}
   */
  getTodoItems() {
    return this.#items;
  }

  /**
   * TodoListの状態が更新されたときに呼び出されるリスナー関数を登録する
   * @param {Function} listener
   */
  onChange(listener) {
    this.addEventListener("change", listener);
  }

  /**
   * `onChange`で登録したリスナー関数を解除する
   * @param {Function} listener
   */
  offChange(listener) {
    this.removeEventListener("change", listener);
  }

  /**
   * 状態が変更されたときに呼ぶ。登録済みのリスナー関数を呼び出す
   */
  emitChange() {
    this.emit("change");
  }

  /**
   * TodoItemを追加する
   * @param {TodoItemModel} todoItem
   */
  addTodo(todoItem) {
    this.#items.push(todoItem);
    this.emitChange();
  }

  /**
   * 指定したidのTodoItemのcompleted(完了フラグ)を更新する
   * @param {{ id:number, completed: boolean }}
   */
  updateTodo({ id, completed }) {
    // 渡されたidと一致するものをthis.#itemsから検索して一致したものを取得
    const todoItem = this.#items.find(todo => todo.id === id);
    if (!todoItem) {
      return;
    }
    todoItem.completed = completed;  // 完了フラグを更新する
    this.emitChange();
  }

  /**
   * 指定したidのTodoItemを削除する
   * @param {{ id: number }}
   */
  deleteTodo({ id }) {
    // `id`に一致しないTodoItemを残してthis.#itemsを上書きする
    this.#items = this.#items.filter(todo => {
      return todo.id !== id;
    });
    this.emitChange();
  }

  getEditingId() {
    return this.#editingId;
  }

  editTodo({ id, title }) {
    const todoItem = this.#items.find(todo => todo.id === id);
    if (!todoItem) {
      return;
    }
    todoItem.title = title;  // タイトルを更新する
    this.#editingId = null;
    this.emitChange();
  }

  startEdit({ id }) {
    this.#editingId = id;
    this.emitChange();
  }

}


