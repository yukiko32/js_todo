import { render } from "./view/html-util.js";
import { TodoListView } from "./view/TodoListView.js";
import { TodoItemModel } from "./model/TodoItemModel.js";
import { TodoListModel } from "./model/TodoListModel.js";

export class App {
  #todoListView = new TodoListView();  // #todoListViewインスタンスはcreateElementを持つ
  #todoListModel = new TodoListModel([]);  // #TodoListModelインスタンスは#items配列を持つ

  /**
   * Todoを追加するときに呼ばれるリスナー関数
   * @param {string} title
   */
  handleAdd(title) {
    // TodoListModelの持つ#items配列にTodoItemModelインスタンスを追加する
    this.#todoListModel.addTodo(new TodoItemModel({ title, completed: false }));
  }

  /**
   * Todoの状態を更新したときに呼ばれるリスナー関数
   * @param {{ id:number, completed: boolean }}
   */
  handleUpdate({ id, completed }) {
    // 指定したidのTodoItemのcompletedを更新する
    this.#todoListModel.updateTodo({ id, completed });
  }

  /**
   * Todoを削除したときに呼ばれるリスナー関数
   * @param {{ id: number }}
   */
  handleDelete({ id }) {
    // 指定したidのTodoItemを削除する
    this.#todoListModel.deleteTodo({ id });
  }

  handleEdite({ id, title }) {
    this.#todoListModel.editTodo({ id, title });
  }


  mount() {
    // 一致するidのDOM要素を取得する
    const formElement = document.querySelector("#js-form");
    const inputElement = document.querySelector("#js-form-input");
    const todoItemCountElement = document.querySelector("#js-todo-count");
    const completedItemCountElement = document.querySelector("#js-completed-count");
    const incompletedItemCountElement = document.querySelector("#js-incompleted-count");
    const containerElement = document.querySelector("#js-todo-list");

    // TodoListの状態が更新されたときに呼び出されるリスナー関数を登録する（emitChange()で呼ばれる）
    this.#todoListModel.onChange(() => {
      // #TodoListModelの#items配列を取得
      const todoItems = this.#todoListModel.getTodoItems();
      const todoListElement = this.#todoListView.createElement(todoItems, {
        onUpdateTodo: ({ id, completed }) => {
          this.handleUpdate({ id, completed });
        },
        onDeleteTodo: ({ id }) => {
          this.handleDelete({ id });
        },
        onEditTodo: ({ id, title }) => {
          this.handleEdite({ id, title });
        }
      });
      // 新しいTodoリストで既存のTodoリストを上書きする
      render(todoListElement, containerElement);
      // カウント数を更新
      todoItemCountElement.textContent = `全てのタスク: ${this.#todoListModel.getTotalCount()}`;
      completedItemCountElement.textContent = `完了済み: ${this.#todoListModel.getCompletedCount()}`;
      incompletedItemCountElement.textContent = `未完了: ${this.#todoListModel.getIncompletedCount()}`;
    });

    // form送信時のイベント
    formElement.addEventListener("submit", (event) => {
      event.preventDefault();  // 本来の動作を無効化
      // 入力内容がある場合はTodoアイテムに追加
      if (inputElement.value) {
        this.handleAdd(inputElement.value);
        inputElement.value = "";  // 入力欄をリセット
      }
    });
  }
}
