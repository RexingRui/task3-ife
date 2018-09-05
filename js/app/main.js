/**
 * @file 主模块 使用jquery进行重构
 * @author Rex rexingrui@gmail.com  github.com/RexingRui
 * 
 */
$(document).ready(function() {

	/**
	 * 定义变量  
	 */
	// 三个数组分别存放分类、子分类、任务
	var category = [];
	var subCategory = [];
	var mission = [];
	// 使用localStorage存储数据
	var myStorage = window.localStorage;
	// 初始化 ID
	var idFather = 1;
	var idChild = 1;
	var taskID = 1;

	/**
	 * 分类添加弹出框
	 * param none
	 * return none
	 */
	function loadPop() {
		// 新增类按钮单击事件监听
		var $popOverlay = $(".overlay");
		var $pop = $(".pop");
		var $addCatalog = $(".addCatalog span");
		$addCatalog.click(function(event) {
			//清空文本输入框中的内容
			$categoryNameIn.val("");
			//清空错误类显示
			$errorCategory.html("");
			//弹出选择框以及overlay
			$popOverlay.css("display", "block");
			$pop.css("display", "block");
		});
		// 新增类的文本输入框事件监听
		var $categoryNameIn = $('.category-name');
		var $errorCategory = $('.pop-error');
		$categoryNameIn.on("input", function() {
			// 判断添加的类名是否存在，若存在则报错
			var $checkCategory = $('.on-category');
			$checkCategory.each(function(idx) {
				if ($categoryNameIn.val() == $(this).text().replace(/\([0-9]+\)/, "")) {
					$errorCategory.html("该类名已存在，请更换新类名！");
					return false; 
				} else {
					$errorCategory.html("");
				}
			});

		});
		// 关闭窗口以及取消按钮事件监听
		$("#pop-close, .cancel").click(function() {
			popClose();
		});
		// 类创建确认按钮单击事件监听
		var $select = $('.select-category');
		var $addCategorySure = $('.sure');
		$addCategorySure.click(function() {
			var $checkCategory = $('.on-category');
			//若父类名选择的是无则添加与默认分类同级的类
			if ($select.val() == "无") {
				//创建类
				var newCategory = new Categorys($categoryNameIn.val(), "father" + idFather);
				newCategory.addEvent();
				idFather++;
				var newCategoryText = {
					"id": newCategory.id,
					"name": newCategory.categoryName
				};
				category.push(newCategoryText);
				save();
				//将类添加到下拉表中
				$select.html($select.html() + '<option>' + $categoryNameIn.val() + '</option')
			} else {
				$checkCategory.each(function() {
					if ($select.val() == $(this).text().replace(/\([0-9]+\)/, "")) {
						var fatherID = $(this).attr('id');
						var newCategory = new Categorys($categoryNameIn.val(), 'child' + idChild + '-' + fatherID, fatherID);
						newCategory.addEvent();
						idChild++;
						var newCategoryText = {
							"id": newCategory.id,
							"name": newCategory.categoryName,
							"father": fatherID
						};
						subCategory.push(newCategoryText);
					}
				});
				save();
			}
			popClose();
		});
		// 关闭浮层
		function popClose() {
			$popOverlay.css("display", "none");
			$pop.css("display", "none");
		}
	}

	/**
	 * param {object} event对象
	 * 分类被单击选中的事件处理程序，任何时候只有一个分类被选中
	 * 页面首次加载默认分类被选中，当删除一个分类后，默认分类立即转为被选中状态
	 */
	function choose(event) {
		// 此处判断目标元素是不是含有分类名称的节点，如果点击到分类所含
		// 的任务数（区域），是没有选择效果的
		if (event.target.childElementCount > 0) {
			// 清除右侧任务查看栏  
			var $viewTask = $('.viewTaskColumn');
			$viewTask.css("display", "none");
			// 设定选中状态的背景色，添加选中项的类属性
			var $checkCategory = $('.on-category');
			$checkCategory.css("background-color", "#EEE9E9")
				.removeClass("choose");
			$(event.target).css("background-color", "#FCFCFC");
			$(event.target).addClass("choose");
		}
	}

	// 新增任务单击事件监听
	$(".addTask").on('click', function() {
		var $chooseCategory = $(".choose");
		$(".viewTaskColumn").css("display", "none");	
		var categoryID = $chooseCategory.attr('id');
		if (categoryID.search(/^father/) != -1 &&
			$chooseCategory.next("ul").children().length > 0) {
			var confirmCategory = confirm("请选择该分类的子类");
		} else {
			$("#taskName, #deadline, #taskContent").val("");
			$(".addNewTaskColumn").css("display", "block");
		}
	});

	// 任务名称编辑输入事件监听
	$("#taskName").on('input', function() {
		var $taskNameError = $(".task-name-error");
		$(".task-name").each(function() {
			if($("#taskName").val() == $(this).text()) {
				$taskNameError.html("该任务名已经存在，请更换")
							  .css("color", "red");
				return false;
			} else{
				$taskNameError.html("");
			}
		});
	});

	// 阻止默认行为提交表单
	// 表单中按钮默认submit类型，按enter键也会触发submit
	$("#task-form").on('submit', function(event) {
		event.preventDefault();
	})

	// 编辑任务确认按钮单击事件监听
	// 两种可能，新建任务/修改任务
	$(".sure-task").on('click', function() {
		if ($("#taskName").val() && $("#deadline").val() && $("#taskContent").val()) {
			var $chooseCategory = $(".choose");
			var idNum = $chooseCategory.attr('id');
			var tag = false;
			$(".task-name").each(function() {
				if($("#taskName").val().trim() == $(this).text()) {
					tag = true;
				}
			});

			if (tag == false) {
				var newTask = new Tasks( $("#taskName").val(),
					$("#deadline").val(),
					$("#taskContent").val(),
					idNum, taskID, "unComplete");
				newTask.addTask(newTask.name, 
								newTask.id, 
								newTask.date, 
								newTask.belong, 
								newTask.content, 
								newTask.completeState);

				var newTaskText = {
					"id": taskID + "",
					"belong": idNum,
					"name": newTask.name,
					"date": newTask.date,
					"content": newTask.content,
					"completeState": "unComplete"
				}
				mission.push(newTaskText);
				taskID++;
			} else {
				var $taskChoose = $(".choose-task");
				var taskChooseID = $taskChoose.attr('id');
				var deadline = $("#deadline").val().trim();
								 
				mission.forEach(function(a) {
					if (a.date == deadline) {
						if ($taskChoose.parent("li").children().length > 2) {
							var $taskDelete = $taskChoose.detach();
							var $newBelong = $("#" + a.id).parent("li");
							$newBelong.append($taskDelete);
						} 
					}
					if (a.id == taskChooseID) {
							a.content = $("#taskContent").val();
							a.date = deadline;
						}
				});
				$taskChoose.parent("li").children("p:first").text(deadline); 
			}
			save();
			//按日期进行排序
			dateSort(idNum);
			//关闭编辑窗口
			$(".addNewTaskColumn").css("display", "none");
		}
	});

	// 任务查看页面编辑按钮单击事件监听
	$(".icon-edit").on('click', function (e) {
		$(".viewTaskColumn").css("display", "none");
		$("#taskName").val($(".task-name-v").text());
		$("#deadline").val($(".task-date-v").text());
		$("#taskContent").val($(".task-content-v").text());
		$(".addNewTaskColumn").css("display", "block");  
	});

	// 任务查看页面完成按钮单击事件监听 
	$(".icon-complete").on('click', function (e) {
		var completeConfirm = confirm("确认完成任务");
		if (completeConfirm) {
			var $taskChooseComplete = $(".choose-task");
			$taskChooseComplete.removeClass("unComplete")
							   .addClass("complete");
			$('.viewTaskColumn').css("display", "none");
			$(".addNewTaskColumn").css("display", "none");
			mission.forEach(function (a) {
				if (a.id == $taskChooseComplete.attr('id')) {
					a.completeState = "complete";
				}
			});
			save();
		}
	});

	//编辑任务取消按钮单击事件监听
	$(".cancel-task").on('click', function (e) {
		$(".addNewTaskColumn").css("display", "none");
		return false;
	})

	//任务状态单击事件监听	
	$(".middle-task").on('click', function (e) {
		$(".viewTaskColumn").css("display", "none");
		$(".middle-task").css("background-color", "#EDEDED");
		$(this).css("background-color", "#B4CDCD");
		displayAllTask(e);
	}).first().css("background-color", "#B4CDCD");

	/**
	 * 显示分类所包含的任务
	 * param [Object] 事件对象
	 * return none
	 */
	function displayAllTask(e) {
		var $target = $(e.target);
		var $chooseCategory = $(".choose");
		$(".task-list").css("display", "none");
		var taskArray = [];
		var idNum = $chooseCategory.attr('id');
		$(".task-name, .task-date").css("display", "block");
		//对于父类和子类显示不同的任务列表
		if (idNum.search('child') == -1  
			&& $chooseCategory.next("ul").children().length > 0) {
			var $children = $chooseCategory.next("ul").children("li");
			$children.each(function() {
				var $allTask = $("." + $(this).children("p:first").attr('id'));
				$allTask.each(function() {
					if (!($(this) in taskArray)) {
						var taskComplete = $(this).find(".complete");
						var taskUncomplete = $(this).find(".unComplete");
						if ($target.text().trim() == $(".middle-task").eq(1).text().trim()) {
							$(this).find(".complete").css("display", "none");
							if(taskComplete.length != 0 && taskUncomplete.length == 0) {
								$(this).children("p:first").css("display", "none");
							}
						} else if ($target.text().trim() == $(".middle-task").eq(2).text().trim()) {
							$(this).find(".unComplete").css("display", "none");
							if(taskComplete.length == 0 && taskUncomplete.length != 0) {
								$(this).children("p:first").css("display", "none");
							} 
						}
						taskArray.push($(this));
					}
				});
			});

			if (taskArray.length > 1) {
				var newtaskArray = taskArray.slice(0, -1);
				newtaskArray.forEach(function(a) {
					var prevDate = a.children("p:first").text();
					var nextDate = a.next().children("p:first").text();
					if (prevDate == nextDate) {
						a.next().children("p:first").css("display", "none");
					}
				});
			}
		} else {
			var $allTask = $("." + idNum);
			$allTask.each(function() {
				if (!($(this) in taskArray)) {
					var taskComplete = $(this).find(".complete");
					var taskUncomplete = $(this).find(".unComplete");
					if ($target.text().trim() == $(".middle-task").eq(1).text().trim()) {
						$(this).find(".complete").css("display", "none");
						if(taskComplete.length != 0 && taskUncomplete.length == 0) {
							$(this).children("p:first").css("display", "none");
						}
					} else if ($target.text().trim() == $(".middle-task").eq(2).text().trim()) {
						$(this).find(".unComplete").css("display", "none");
						if(taskComplete.length == 0 && taskUncomplete.length != 0) {
							$(this).children("p:first").css("display", "none");
						} 
					}
					taskArray.push($(this));
				}
			});
		}
		taskArray.sort(sortDate);
		var $taskList = $(".task");
		taskArray.forEach(function(a) {
			$taskList.append(a);
			a.css("display", "block");
		});
	}

	/**
	 * 同一分类下任务排序
	 * param [String] 某分类的id
	 * return none
	 */
	function dateSort(id) {
		var taskArray = [];
		var $taskList = $(".task-list"+ "." + id);
		$taskList.each(function() {
			taskArray.push($(this));
		});
		taskArray.sort(sortDate);
		var $task = $(".task")
		taskArray.forEach(function(a) {
			$task.append(a);
		});
	}

	/**
	 * 存储数据到localStorage
	 * param none
	 * return none
	 */
	function save() {
		myStorage.category = JSON.stringify(category);
		myStorage.subCategory = JSON.stringify(subCategory);
		myStorage.mission = JSON.stringify(mission);
	}

	/**
	 * 页面初始化
	 * param none
	 * return none
	 */
	function initialize() {
		// 在分类栏添加所有任务标签
		$('.catalogs').before($("<p>所有分类</p>").css("margin", "10% 30px -3% "));
		// 默认分类单击事件
		$("#default-file p").on('click', function (event) {
			choose(event);
			$(".middle-task:first").trigger('click');
		});
		//加载浮层与本地数据
		loadPop();
		loadData();
		$("#default-file p").trigger('click');
	}

	/**
	 * 分类构造
	 * @class
	 * @param {string} categoryName 分类名
	 * @param {string} id 分类ID
	 * @param {string} father 子分类的父类
	 */
	 
	function Categorys(categoryName, id, father) {
		this.categoryName = categoryName;
		this.id = id;
		this.father = father;
	}

	Categorys.prototype.addEvent = function() {
		this.newFile = $("<li class='addfile'></li>")
		this.newFile.html("<p class='on-category'" 
			+ "id=" + this.id + ">" 
			+ "<i class='ico ico-18 ico-cate'></i>" 
			+ this.categoryName
			+ "<span>" + '(0)' + "</span>" 
			+ "<i class='delete icon-delete'></i>"
			+ "</p>");

		if (this.father) {
			this.newFile.find(".ico").removeClass("ico-cate").addClass("ico-subcate");
			var $parent = $("#" + this.father);
			$parent.next("ul").append(this.newFile)
		} else {
			$('#default-file').before(this.newFile);
			this.newFile.append("<ul class='subfile'></ul>")
		}

		//类选中事件监听
		this.newFile.children("p:first").on('click', function(event) {
			choose(event);
			//选中一个分类后，模拟鼠标单击事件，单击任务栏中该分类下的所有任务
			$(".middle-task:first").trigger('click');
		});

		//鼠标悬停在分类事件监听(删除分类)
		var $imgDelete = this.newFile.find(".delete");

		this.newFile.children("p").hover(function(e) {
			$imgDelete.css("display", "inline");
		}, function(e) {
			$imgDelete.css("display", "none");
		});
		//删除分类图标单击事件监听
		$imgDelete.on('click', function(event) {imgDeleteFunc(event);});
	};

	/**
	 * 任务构造
	 * @class
	 * @param {string} name 任务名
	 * @param {string} date 任务完成日期
	 * @param {string} content 任务内容
	 * @param {string} belong 任务所属分类
	 * @param {number} id 任务ID
	 * @param {string} completeState 任务状态
	 */
	function Tasks(name, date, content, belong, id, completeState) {
		this.name = name;
		this.date = date;
		this.content = content;
		this.id = id;
		this.completeState = completeState;
		this.belong = belong;
    }

    Tasks.prototype.addTask = function(name, id, date, belong, content, completeState) {
		
		function createTaskName() {
			var $taskName = $("<p class='task-name'" + "id=" + id + ">" 
							+ "<i class='ico ico-18 ico-complete'></i>"
							+ name 
							+ "</p>");
			$taskName.addClass(completeState);
			var $chooseCategory = $("#" + belong);
			var $taskNumber = $chooseCategory.find("span");
			var num = parseInt($taskNumber.text().match(/\(([0-9]+)\)/)[1]) + 1;
			$taskNumber.text($taskNumber.text().replace(/\(([0-9]+)\)/, '(' + num + ')'));
			//如果给分类有父分类，则也要相应的修改父分类中的项目数		
			var chooseCategoryDadId = $chooseCategory.attr('id').replace(/^c(.*?)\-/, '');
			if (chooseCategoryDadId != belong) {
				var $taskNumberDad = $("#" + chooseCategoryDadId).find("span");
				var numDad = parseInt($taskNumberDad.text().match(/\(([0-9]+)\)/)[1]) + 1;
				$taskNumberDad.text($taskNumberDad.text().replace(/\(([0-9]+)\)/, '(' + numDad + ')'));
			}

			$taskName.on('click', function (e) {
				var task;
				var id = $(this).attr('id');
				mission.forEach(function (a) {
					if (id == a.id) {
						task = a;
					}
				});
				$(".task-name").css("background-color", "#FFFFFF")
							   .removeClass('choose-task');
				$(this).css("background-color", "#8DB6CD")
					   .addClass('choose-task');
				$(".task-name-v span").remove();
				$(".icon-complete").before($("<span>" + task.name + "</span>"));
				$(".task-date-v").text($(this).parent("li").children("p:first").text());
				$(".task-content-v").text(task.content);
				if ($(this).hasClass('complete')) {
					$(".icon-complete, .icon-edit").css("display", "none");
				} else {
					$(".icon-complete, .icon-edit").css("display","inline");
				}
				$('.viewTaskColumn').css("display", "block");
				
				});
			return $taskName;
		}

		function createTaskDate() {
			var $taskNode = $("<li class='task-list'" + "></li>");
			$taskNode.addClass(belong);
			var $deadline = $("<p class='task-date'>" + date + "</p>");
			$taskName = createTaskName();
			$taskNode.append($deadline).append($taskName);
			$(".task").append($taskNode);
		}
		//根据仍任务时间聚类
		var $taskDate = $(".task-date");
		if ($taskDate.length != 0) {
			var $taskLi = $("." + belong);
			var tag = true;
			$taskLi.each(function () {
				if(date == $(this).find("p:first").text()) {
					tag = false;
					var $taskName = createTaskName();
					$(this).children("p:first").next("p").before($taskName);
				}
			});
			if (tag) {
				createTaskDate();
			}
		} else {
			createTaskDate();
		}
		//任务名称单击事件	
	};

	/**
	 * 模拟事件
	 * @param {string} eventCategory 事件类型(UI事件，鼠标事件等)
	 * @param {string} eventsType 事件类型下的子类（鼠标事件包括单击，双击等）
	 * @return none
	 */
	function doClick(eventCategory, eventType, ele) {
		var event = document.createEvent(eventCategory);
		// 对事件初始化
		event.initEvent(eventType, true, true);
		// 触发事件
		ele.dispatchEvent(event);
	}

	/**
	 * 排序
	 * @param {string} a 元素节点
	 * @param {string} b 元素节点
	 * @return {number} 用sort()的参数
	 */
	function sortDate(a, b) {
		return parseInt(a.children("p:first").text().replace(/\-/g, '')) -
			parseInt(b.children("p:first").text().replace(/\-/g, ''));
	}

	/**
	 * 单击分类删除的事件处理程序
	 * 需要区分删除的父类还是子类
	 * param {object} event事件对象
	 * return none
	 */
	function imgDeleteFunc(event) {
		var $target = $(event.target);
		var confirmDelete = confirm("确认删除分类么");
		if (confirmDelete) {
			var tag = $target.parent("p").attr('id').search(/child/);
			if(tag !== -1) {
				// 删除子类
				// 子类被删除后父类中的任务数更新
				var deleteTaskNum = parseInt($target.prev("span").text().match(/\(([0-9]+)\)/)[1]);
				var fatherID = $target.parent("p").attr('id').replace(/child[0-9]+\-/, '');
				var $parentCategory = $("#" + fatherID);
				var originalNum = parseInt($parentCategory.text().match(/\(([0-9]+)\)/)[1]);
				var $span = $parentCategory.find("span");
				$span.text('(' + (originalNum - deleteTaskNum) + ')');
				var deleteID = $target.parent("p").attr('id');
				$("." + deleteID).remove();
				mission = mission.filter(function(item, index, array) {
							return item.belong != deleteID;
						});
				subCategory = subCategory.filter(function(item, index, array) {
					return item.id != deleteID;
				});
				save();
				$target.parent("p").remove;
			} else {
				// 删除父类
				// 删除选择框中父类选项
				var deleteCategoryName = $target.parent("p").text().replace(/\([0-9]+\)/, "");
				$("option").each(function () {
					if ($(this).text().trim() == deleteCategoryName) {
						$(this).remove();
					}
				});
				// 判断该分类是否有子类
				var deleteID = $target.parent("p").attr('id');
				var $deleteCategory = $target.parent("p").next("ul").children("li");
				$deleteCategory.each(function () {
					var deleteSubID = $(this).attr('id');
					$("." + deleteID).remove();
					mission = mission.filter(function(item, index, array) {
						return item.belong != deleteSubID;
					});
					subCategory = subCategory.filter(function(item, index, array) {
						return item.id != deleteSubID;
					});
				});
				$("." + deleteID).remove();
				mission = mission.filter(function(item, index, array) {
					return item.belong != deleteID;
				});
			}
			category = category.filter(function(item, index, array) {
				return item.id != deleteID;
			});
			save();
			$target.parent().parent("li").remove();
		}
		$("#default-file p").trigger('click');
		return false;
	}

	/**
	 * 加载本地存储的数据
	 * param none
	* return none
	*/
	function loadData() {
		if (localStorage.category) {
			category = JSON.parse(localStorage.category);
			subCategory = JSON.parse(localStorage.subCategory);
			mission = JSON.parse(localStorage.mission);
		}
		for (var i = 0; i < category.length; i++) {
			var newCategory = new Categorys(category[i].name, category[i].id);
			newCategory.addEvent();
			idFather++;
			var $select = $('.select-category');
			$select.html($select.html() + '<option>' + category[i].name + '</option');
		}

		for (var i = 0; i < subCategory.length; i++) {
			var newSubTasks = new Categorys(
				subCategory[i].name,
				subCategory[i].id,
				subCategory[i].father);
			newSubTasks.addEvent();
			idChild++;
		}

		for (var i = 0; i < mission.length; i++) {
			var newTask = new Tasks(
				mission[i].name,
				mission[i].date,
				mission[i].content,
				mission[i].belong,
				mission[i].id,
				mission[i].completeState);
			newTask.addTask(newTask.name, 
							newTask.id, 
							newTask.date, 
							newTask.belong, 
							newTask.content, 
							newTask.completeState);
			taskID++;
		}
	}
	
	// 页面初始化
	initialize() 
});