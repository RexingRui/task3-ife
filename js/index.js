/**
* created by Rex
* 2018/8/8
*/


/**
*分类栏
*/
//插入所有分类的标签
var leftColumn = document.getElementsByClassName('left-column')[0];
var catalogs = document.getElementsByClassName('catalogs')[0];
var allCatalog = document.createElement("p");
allCatalog.innerHTML = "所有分类";
leftColumn.insertBefore(allCatalog, catalogs);
allCatalog.style.margin = "10% 30px -3% ";
var addCatalog = document.getElementsByClassName('addCatalog')[0].firstElementChild;
var files = document.getElementsByClassName('file')[0];
var defaultFile = document.getElementById('default-file');
defaultFile.firstElementChild.style.backgroundColor = "#FCFCFC";
defaultFile.firstElementChild.onclick = function(event) {
	choose(event);
}


//分类构造函数
function Category(categoryName, node) {
	
	this.categoryName = categoryName;
	this.node = node;
	this.newFile = document.createElement('li');
	this.newFile.className = "addfile";


	if (this.node) {
		this.id = idChild;
		idChild++;
		var fatherID = this.node.firstElementChild.getAttribute('id')
		this.newFile.innerHTML = "<p class='on-category'"
		+"id=child" + this.id + "-" + fatherID + ">"
		+"<i class='ico ico-18 ico-subcate'></i>" 
		+ this.categoryName 
		+"<span>" + '(0)' + "</span>"
		+"<i class='delete icon-delete'></i>"
		+"</p>";
		var ulNode = this.node.getElementsByTagName('ul')[0];
		ulNode.appendChild(this.newFile);
	}
	else { 
		this.id = idFather;
		idFather++;
		this.newFile.innerHTML = "<p class='on-category'"
		+"id=father" + this.id + ">" 
		+ this.categoryName
		+"<i class='ico ico-18 ico-cate'></i>"  
		+"<span>" + '(0)' + "</span>"
		+"<i class='delete icon-delete'></i>"
		+"</p>";
		files.insertBefore(this.newFile, defaultFile);
		var temp = document.createElement('ul');
		temp.className = "subfile";
		this.newFile.appendChild(temp);
	}

	//类选中事件监听
	this.newFile.firstElementChild.onclick = function(event) {
		choose(event);
			//自动触发中间栏所有任务的click事件
		var e = document.createEvent("MouseEvents");
		e.initEvent("click", true, true);
		taskState[0].dispatchEvent(e);
	}
	
	//鼠标悬停在分类事件监听(删除分类)
	var imgDelete = this.newFile.getElementsByClassName('delete')[0];
	var onCategory = this.newFile.getElementsByClassName('on-category')[0];
	onCategory.onmouseover = function() {
		imgDelete.style.display = "inline";
	}

	onCategory.onmouseout = function() {
		imgDelete.style.display = "none";
	}

	//删除分类图标单击事件监听
	imgDelete.onclick = function(event) {
		//当触发删除click事件时，类的click(choose)取消
		event.target.parentNode.onclick = null;
		var task = document.getElementsByClassName('task')[0];
		var confirmDelete = confirm("确认删除该分类么？");
		if(confirmDelete) {

			if(node) {
				var deleteTaskNum = parseInt(this.previousElementSibling.textContent.match(/\(([0-9]+)\)/)[1]);
				var fatherID = this.parentNode.getAttribute('id').replace(/child[0-9]+\-/,'');
				var parentCategory = document.getElementById(fatherID);
				var orignalNum = parseInt(parentCategory.textContent.match(/\(([0-9]+)\)/)[1]);
				/*parentCategory.textContent = parentCategory.textContent
				.replace(/\(([0-9]+)\)/, '('+(orignalNum-deleteTaskNum) + ')');*/
				var span = parentCategory.getElementsByTagName('span')[0];
				ulNode.removeChild(this.parentNode.parentNode);
				span.textContent = '('+(orignalNum-deleteTaskNum) + ')';
				var deleteID = this.parentNode.getAttribute('id');
				var deleteTask = document.getElementsByClassName(deleteID);
				for (var i = 0; i < deleteTask.length; i++) {
					task.removeChild(deleteTask[i]);
					mission = mission.filter(function(item, index, array) {
						return item.belong != deleteID;
					});
				}
				subCategory = subCategory.filter(function(item, index, array) {
					return item.id != deleteID;
				});
				save();
			}
			else {
				//删除让新建任务弹出栏的分类option
				var deleteCategoryName = this.parentNode.textContent.replace(/\([0-9]+\)/,"");
				var select = document.getElementsByClassName('select-category')[0];
				var options = document.getElementsByTagName('option');
				for(var i = 0; i < options.length; i++) {
					if (options[i].textContent == deleteCategoryName) {
						select.removeChild(options[i]);
					}
				}
				files.removeChild(this.parentNode.parentNode);
				var deleteID = this.parentNode.getAttribute('id');
				var temp = this.parentNode.nextElementSibling;
				var deleteCategory = temp.getElementsByClassName('on-category');
				if(deleteCategory.length > 0) {
					for(var i = 0; i < deleteCategory.length; i++) {
						var deleteSubID = deleteCategory[i].getAttribute('id');
						var deleteTask = document.getElementsByClassName(deleteSubID);
						for (var i = 0; i < deleteTask.length; i++) {
						task.removeChild(deleteTask[i]);			
						}
						mission = mission.filter(function(item, index, array) {
							return item.belong != deleteSubID;
						});
						subCategory = subCategory.filter(function(item, index, array) {
							return item.id != deleteSubID;
						});
					}
					category = category.filter(function(item, index, array) {
						return item.id != deleteID;
					});
					save();
				}
				else {
					var deleteTask = document.getElementsByClassName(deleteID);
					for (var i = 0; i < deleteTask.length; i++) {
						task.removeChild(deleteTask[i]);
					}
					mission = mission.filter(function(item, index, array) {
						return item.belong != deleteID;
					});
					category = category.filter(function(item, index, array) {
						return item.id != deleteID;
					});
					save();
				}
			}
		}
	//删除结束后返回默认分类
	//创建事件
	var event = document.createEvent('MouseEvents');
	//对事件初始化
	event.initEvent('click', true, true);
	//触发事件
	defaultFile.firstElementChild.dispatchEvent(event);
	}



}

//新增类按钮单击事件监听
var popOverlay = document.getElementsByClassName('overlay')[0];
var pop = document.getElementsByClassName('pop')[0];
addCatalog.onclick = function(event) {

	//清空文本输入框中的内容
	categoryNameIn.value = "";	
	//清空错误类显示
	errorCategory.innerHTML = "";
	//弹出选择框以及overlay
	popOverlay.style.display = "block";
	pop.style.display = "block";
}

//新增类的文本输入框事件监听
var categoryNameIn = document.getElementsByClassName('category-name')[0];
var errorCategory = document.getElementsByClassName('pop-error')[0];

categoryNameIn.oninput = function() {
//判断添加的类名是否存在，若存在则报错
var checkCategory = document.getElementsByClassName('on-category');
	for (var i = 0; i < checkCategory.length; i++) {
		if(categoryNameIn.value == checkCategory[i].textContent.replace(/\([0-9]+\)/, "")) {	
			errorCategory.innerHTML = "该类名已存在，请更换新类名！";
			break;
		}
		else {
			errorCategory.innerHTML = "";
		}
	}
}

//关闭窗口以及取消按钮事件监听
var popClose1 = document.getElementById('pop-close');
popClose1.onclick = function() { popClose(); };
var popCancel = document.getElementsByClassName('cancel')[0];
popCancel.onclick = function() { popClose(); };

//类创建确认按钮单击事件监听
category = [];
subCategory = [];
var select = document.getElementsByClassName('select-category')[0];
var addCategorySure = document.getElementsByClassName('sure')[0];
addCategorySure.onclick = function() {
	var checkCategory = document.getElementsByClassName('on-category');
	//若父类名选择的是无则添加与默认分类同级的类
	if (select.value == "无") {
		//创建类
		var newCategory = new Category(categoryNameIn.value);
		var newCategoryText = {
			"id": "father"+ newCategory.id,
			"name": newCategory.categoryName
		};
		category.push(newCategoryText);
		save();
		//将类添加到下拉表中
		select.innerHTML += '<option>' + categoryNameIn.value + '</option';
	} else {
		for (var i = 0; i < checkCategory.length; i++) {
			if(select.value == checkCategory[i].textContent.replace(/\([0-9]+\)/, "")) {
				var newCategory = new Category(categoryNameIn.value
					, checkCategory[i].parentNode);
				var fatherID = checkCategory[i].getAttribute('id');
				var newCategoryText = {
					"id": "child" + newCategory.id + "-" + fatherID,
					"name": newCategory.categoryName,
					"father": fatherID
				};
				subCategory.push(newCategoryText);	
			}	
		}
		save();
	}
	popClose();
}
//关闭浮层
function popClose() {
	popOverlay.style.display = "none";
	pop.style.display = "none";
}

//选中的分类
function choose(event) {
	if(event.target.childElementCount > 0) {
	//清除右侧任务查看栏  
	var viewTask = document.getElementsByClassName('viewTaskColumn')[0];
	viewTask.style.display = "none";
	var checkCategory = document.getElementsByClassName('on-category');
	for(var i = 0; i < checkCategory.length; i++) {
		checkCategory[i].style.backgroundColor = "#EEE9E9";
		//checkCategory[i].style.backgroundImage = "url('./img/css_spirtes.png')";
		checkCategory[i].className = checkCategory[i].className.replace(' choose', '');
	}
	event.target.style.backgroundColor = "#FCFCFC";

	//由于程序运行开始时，默认分类是选中状态，需要排除
	if(event.target.className.search('choose') == -1) {
		event.target.className += ' choose';
	}

	//显示中间任务栏页面
	var task = document.getElementsByClassName('task-list');
	for(var i = 0; i < task.length; i++) {
		task[i].style.display = "none";
	}
	var taskArray = [];
	var idNum = event.target.getAttribute('id');
	//对于父类和子类显示不同的任务列表
	if (idNum.search('child') == -1 && event.target.nextElementSibling.childElementCount > 0) {
		var children = event.target.nextElementSibling.childNodes;
		for(var i = 0; i < children.length; i++) {
			console.log(1);
			var allTask = document.getElementsByClassName(children[i]
				.firstElementChild.getAttribute('id'));
			for(var j = 0; j < allTask.length; j++) {
				if(!(allTask[j] in taskArray)) {
					taskArray.push(allTask[j]);
				}
			}
		}
	}
	else 
	{
		var allTask = document.getElementsByClassName(idNum);
		for(var i = 0; i < allTask.length; i++) {
			if(!(allTask[i] in taskArray)) {
				taskArray.push(allTask[i]);
			}
		}
	}

	taskArray.sort(sortDate);

	function sortDate(a, b) {
		return parseInt(a.firstChild.textContent.replace(/\-/g, '')) 
		- parseInt(b.firstChild.textContent.replace(/\-/g, ''));  
	}
	taskArray.forEach(function(a) {
		taskList.appendChild(a);
	})

	for(var i = 0; i < taskArray.length; i++) {
		taskArray[i].style.display = "block";
	}
	}
}

/**
中间栏
*/

//新增任务单击事件监听
var taskNameNode = document.getElementById('taskName');
var deadlineNode = document.getElementById('deadline');
var taskContentNode = document.getElementById('taskContent');
var addTaskClick = document.getElementsByClassName('addTask')[0].firstElementChild;
var addNewTaskColumn = document.getElementsByClassName('addNewTaskColumn')[0];
addTaskClick.onclick = function() {
	var chooseCategory = document.getElementsByClassName('choose')[0];
	if (chooseCategory) {
		var viewTask = document.getElementsByClassName('viewTaskColumn')[0];
		viewTask.style.display = "none";
		var chooseCategory = document.getElementsByClassName('choose')[0];
		var categoryID = chooseCategory.getAttribute('id');
		if (categoryID.search(/^father/) != -1 
			&& chooseCategory.nextElementSibling.childElementCount > 0) {
				var confirmCategory = confirm("请选择该分类的子类");
		}
		else {
			taskNameNode.value = deadlineNode.value = taskContentNode.value ="";
			addNewTaskColumn.style.display = "block";
		}
	}	
	else {
		var confirmChoose = confirm("请选择一个分类"); 
	}
};

//任务名称编辑输入事件监听
taskNameNode.oninput = function() {
	var taskNameMiddle = document.getElementsByClassName('task-name');
	var taskNameError = document.getElementsByClassName('task-name-error')[0];
	for(var i = 0; i < taskNameMiddle.length; i++) {
		if (taskNameNode.value == taskNameMiddle[i].textContent) {
			taskNameError.innerHTML = "该任务名已经存在，请更换";
			taskNameError.style.color = "red";
			break;
		}
		else {
			taskNameError.innerHTML = "";
		}

	}
};

//阻止默认行为提交表单
//表单中按钮默认submit类型，按enter键也会触发submit
var myForm = document.getElementById('task-form');
myForm.onsubmit = function(event) {
	event.preventDefault();
}

//编辑任务确认按钮单击事件监听
var mission = [];
var editTaskSure = document.getElementsByClassName('sure-task')[0];
editTaskSure.onclick = function() {
	if(taskNameNode.value && deadlineNode.value && taskContentNode.value ) {
		var tag = false;
		var oldTask = document.getElementsByClassName('task-name');
		for(var i = 0; i < oldTask.length; i++) {
			if (taskNameNode.value == oldTask[i].textContent) {
				tag = true;
			}
		}

		if(tag == false) {
			var chooseCategory = document.getElementsByClassName('choose')[0];
			var idNum = chooseCategory.getAttribute('id');
			var newTask = new Task(taskNameNode.value, 
				deadlineNode.value, 
				taskContentNode.value,
				idNum);
			var taskID = newTask.returnID() - 1;
			var newTaskText = {
				"id": taskID + "",
				"belong" : idNum,
				"name": newTask.name,
				"date": newTask.date,
				"content": newTask.content,
				"completeState": "unComplete"
			}
			mission.push(newTaskText);
			save();

		}
		else {
			var taskChoose = document.getElementsByClassName('choose-task')[0];
			var taskChooseID = taskChoose.getAttribute('id');
			taskCurrentID = taskChooseID;
			chooseContent = taskContentNode.value;
			mission.forEach(function(a){
				if(a.id == taskChooseID) {
					a.content = taskContent.value;
				}
			});
			save();
		}


		//按日期进行排序
		dateSort();
		//关闭编辑窗口
		addNewTaskColumn.style.display = "none";
	}
}


var taskCurrentID;
var chooseContent = "";
var taskList = document.getElementsByClassName('task')[0];
function Task(name, date, content, belong) {
	this.name = name;
	this.date = date;
	this.content = content;

	//创建任务名称节点
	this.createTaskName =function() {
		var taskName = document.createElement('p');
		taskName.className = "task-name unComplete ";
		taskName.innerHTML = "<i class='ico ico-18 ico-complete'></i>" + this.name;
		taskName.setAttribute('id',taskID);
		taskName.style.borderBottom = "1px solid #D4D4D4";
		taskID++;

		//记录在分类中的任务数量
		var chooseCategory = document.getElementById(belong);
		if (chooseCategory) {
			var taskNumber = chooseCategory.getElementsByTagName('span')[0];
			var num =  parseInt(taskNumber.textContent.match(/\(([0-9]+)\)/)[1]) + 1
			taskNumber.textContent = taskNumber.textContent.replace(/\(([0-9]+)\)/, '(' + num + ')');
			var chooseCategoryDadId = chooseCategory.getAttribute('id').replace(/^c(.*?)\-/, '');
			if(chooseCategoryDadId != belong) {
				var chooseCategoryDad = document.getElementById(chooseCategoryDadId);
				var taskNumberDad = chooseCategoryDad.getElementsByTagName('span')[0];
				var numDad =  parseInt(taskNumberDad.textContent.match(/\(([0-9]+)\)/)[1]) + 1
				taskNumberDad.textContent = taskNumberDad.textContent.replace(/\(([0-9]+)\)/, '(' + numDad + ')');
				}
		}

		return taskName;
	}

	this.returnID = function() {
		return taskID;
	}


	//创建任务时间节点
	this.createTaskDate = function() {
		var taskNode = document.createElement('li');
		taskNode.className = "task-list " + belong;
		taskList.appendChild(taskNode);
		var deadline = document.createElement('p');
		deadline.className = "task-date";
		deadline.textContent = this.date;
		taskNode.appendChild(deadline);
		taskName = this.createTaskName();
		taskNode.appendChild(taskName);
	}

	//根据仍任务时间聚类
	var taskDate = document.getElementsByClassName('task-date');
	if (taskDate.length != 0) {
		var taskLi = document.getElementsByClassName(belong);
		var tag = true;
		for (var i = 0; i < taskLi.length; i++) {
			if (this.date == taskLi[i].firstElementChild.firstChild.textContent) {
				tag = false;
				taskName = this.createTaskName();
				taskLi[i].insertBefore(taskName,taskLi[i].firstElementChild.nextElementSibling);

			}
		}
		if (tag) {
			this.createTaskDate();
		}
	}
	else{	
		this.createTaskDate();
	}

	//中栏任务名称单击事件监听
	taskName.onclick = function() {
		var taskNameMiddle = document.getElementsByClassName('task-name');
		for(var i = 0; i < taskNameMiddle.length; i++) {
			taskNameMiddle[i].style.backgroundColor = "#FFFFFF";	 
			taskNameMiddle[i].className = taskNameMiddle[i].className
			.replace(' choose-task', '');
		}

		this.style.backgroundColor = "#8DB6CD";
		this.className += " choose-task";

		var taskNameView = document.getElementsByClassName('task-name-v')[0];
		while (taskNameView.firstChild.nodeType == 3) {
			taskNameView.removeChild(taskNameView.firstChild);
		}
		var temp = document.createTextNode(this.textContent);
		var imgComplete = document.getElementsByClassName('icon-complete')[0];
		taskNameView.insertBefore(temp, imgComplete);
		var taskDateView = document.getElementsByClassName('task-date-v')[0];
		taskDateView.textContent = this.parentNode.firstElementChild.textContent;	
		var taskContentView	= document.getElementsByClassName('task-content-v')[0];
		//对当前的任务内容记录
		if(taskCurrentID && taskCurrentID == this.getAttribute('id')) {
			taskContentView.textContent = chooseContent;  
		}
		else {
			taskContentView.textContent = content;
		}
		if (this.className.search('complete') != -1) {
			imgComplete.style.display = "none";
			imgEdit.style.display = "none";	
		} else {
			imgComplete.style.display = "inline";
			imgEdit.style.display = "inline";	
		}
		viewTask.style.display = "block";
	};
}

// 任务查看页面编辑按钮单击事件监听
var viewTask = document.getElementsByClassName('viewTaskColumn')[0];
var imgEdit = document.getElementsByClassName('icon-edit')[0];
imgEdit.onclick = function(event) {
	var viewTask = document.getElementsByClassName('viewTaskColumn')[0];
	viewTask.style.display = "none";
	var taskNameView = document.getElementsByClassName('task-name-v')[0];
	var taskDateView = document.getElementsByClassName('task-date-v')[0];
	var taskContentView	= document.getElementsByClassName('task-content-v')[0];
	taskNameNode.value = taskNameView.textContent.replace(/[\n\s]/g, '');
	deadlineNode.value =  taskDateView.textContent;
	taskContentNode.value = taskContentView.textContent;
	addNewTaskColumn.style.display = "block";

}

// 任务查看页面完成按钮单击事件监听 
var imgComplete = document.getElementsByClassName('icon-complete')[0];
imgComplete.onclick = function(event) {
	var completeConfirm = confirm("确认完成任务");
	if(completeConfirm) {
		var taskChooseComplete = document.getElementsByClassName('choose-task')[0];
		taskChooseComplete.className = taskChooseComplete.className.replace('unComplete', 'complete');
		viewTask.style.display = "none";
		addNewTaskColumn.style.display = "none";

		mission.forEach(function(a) {
			if(a.id == taskChooseComplete.getAttribute('id')) {
				a.completeState = "complete";
			}
		});
		save();
	}
}

//编辑任务取消按钮单击事件监听
var editTaskCancel = document.getElementsByClassName('cancel-task')[0];
editTaskCancel.onclick = function() {
	addNewTaskColumn.style.display = "none";

}

//任务状态单击事件监听	
var taskUncomplete = document.getElementsByClassName('unComplete');
var taskState = document.getElementsByClassName('middle-task');
taskState[0].style.backgroundColor = "#B4CDCD";
taskState[0].onclick = function (event) {
	var viewTask = document.getElementsByClassName('viewTaskColumn')[0];
	viewTask.style.display = "none";
	cleanBackcolor();
	this.style.backgroundColor = "#B4CDCD";
	displayAllTask();
};

taskState[1].onclick = function (event) {
	var viewTask = document.getElementsByClassName('viewTaskColumn')[0];
	viewTask.style.display = "none";
	cleanBackcolor();
	this.style.backgroundColor = "#B4CDCD";
	displayUncompleteTask();

};

taskState[2].onclick = function (event) {
	var viewTask = document.getElementsByClassName('viewTaskColumn')[0];
	viewTask.style.display = "none";
	cleanBackcolor();
	this.style.backgroundColor = "#B4CDCD";
	displaycompleteTask();
};

function cleanBackcolor() {
	for (var i = 0; i < taskState.length; i++) {
		taskState[i].style.backgroundColor = "#EDEDED";
	}
}

function displayAllTask () {
	var chooseCategory = document.getElementsByClassName('choose')[0];
	var task = document.getElementsByClassName('task-list');
	for(var i = 0; i < task.length; i++) {
		task[i].style.display = "none";
	}
	var taskArray = [];
	var idNum = chooseCategory.getAttribute('id');
	//对于父类和子类显示不同的任务列表
	if (idNum.search('child') == -1 && chooseCategory.nextElementSibling.childElementCount > 0) {
		var children = chooseCategory.nextElementSibling.childNodes;
		for(var i = 0; i < children.length; i++) {
			console.log(1);
			var allTask = document.getElementsByClassName(children[i]
				.firstElementChild.getAttribute('id'));
			for(var j = 0; j < allTask.length; j++) {
				displayNodeTask(allTask[j]);
				if(!(allTask[j] in taskArray)) {
					taskArray.push(allTask[j]);
				}

			}
		}
		if (taskArray.length > 1) {
			taskArray.sort(sortDate);
				taskArray.forEach(function(a) {
					taskList.appendChild(a);
				})
			newtaskArray = taskArray.slice(0,-1);
			newtaskArray.forEach(function(a) {
				var prevDate = a.firstElementChild.textContent;
				var nextDate = a.nextElementSibling.firstElementChild.textContent;
				if(prevDate == nextDate) {
					a.nextElementSibling.firstElementChild.style.display = "none";
				}
			});
		}
	}
	else 
	{
		var allTask = document.getElementsByClassName(idNum);
		for(var j = 0; j < allTask.length; j++) {
			displayNodeTask(allTask[j]);
			if(allTask[j] in taskArray) {
				console.log(1);
			}
			else {
			taskArray.push(allTask[j]);
			}
		}
	}

	taskArray.sort(sortDate);

	function sortDate(a, b) {
		return parseInt(a.firstChild.textContent.replace(/\-/g, '')) 
		- parseInt(b.firstChild.textContent.replace(/\-/g, ''));  
	}
	taskArray.forEach(function(a) {
		taskList.appendChild(a);
	})

	for(var i = 0; i < taskArray.length; i++) {
		taskArray[i].style.display = "block";
	}


}

function displayUncompleteTask () {
	var chooseCategory = document.getElementsByClassName('choose')[0];
	var task = document.getElementsByClassName('task-list');
	for(var i = 0; i < task.length; i++) {
		task[i].style.display = "none";
	}
	var taskArray = [];
	var idNum = chooseCategory.getAttribute('id');
	//对于父类和子类显示不同的任务列表
	if (idNum.search('child') == -1 && chooseCategory.nextElementSibling.childElementCount > 0) {
		var children = chooseCategory.nextElementSibling.childNodes;
		for(var i = 0; i < children.length; i++) {
			var allTask = document.getElementsByClassName(children[i]
				.firstElementChild.getAttribute('id'));
			for(var j = 0; j < allTask.length; j++) {
				displayNodeTask(allTask[j]);
				if(!(allTask[j] in taskArray)) {
					var uncompleteTask = allTask[j].getElementsByClassName('unComplete');
					if( uncompleteTask.length == allTask[j].childElementCount - 1) {
						taskArray.push(allTask[j]);
					}
					else if (uncompleteTask.length > 0) {
						var completeTask = allTask[j].getElementsByClassName('complete');
						for(var n = 0; n < completeTask.length; n++) {
							completeTask[n].style.display = "none";
						}
						taskArray.push(allTask[j]);
					} 
				}
			}
		}
		if (taskArray.length > 1) {
			taskArray.sort(sortDate);
			taskArray.forEach(function(a) {
					taskList.appendChild(a);
			})
			newtaskArray = taskArray.slice(0,-1);
			newtaskArray.forEach(function(a) {
				var prevDate = a.firstElementChild.textContent;
				var nextDate = a.nextElementSibling.firstElementChild.textContent;
				if(prevDate == nextDate) {
					a.nextElementSibling.firstElementChild.style.display = "none";
				}
			});
		}
	}
	else 
	{
		var allTask = document.getElementsByClassName(idNum);
		for(var j = 0; j < allTask.length; j++) {
			displayNodeTask(allTask[j]);
			if(!(allTask[j] in taskArray)) {
				var uncompleteTask = allTask[j].getElementsByClassName('unComplete');
				if( uncompleteTask.length == allTask[j].childElementCount - 1) {
					taskArray.push(allTask[j]);
				}
				else if (uncompleteTask.length > 0) {
					var completeTask = allTask[j].getElementsByClassName('complete');
					for(var n = 0; n < completeTask.length; n++) {
						completeTask[n].style.display = "none";
					}
					taskArray.push(allTask[j]);
				}
			}
		}
	}

	taskArray.sort(sortDate);

	function sortDate(a, b) {
		return parseInt(a.firstChild.textContent.replace(/\-/g, '')) 
		- parseInt(b.firstChild.textContent.replace(/\-/g, ''));  
	}
	taskArray.forEach(function(a) {
		taskList.appendChild(a);
	})

	for(var i = 0; i < taskArray.length; i++) {
		taskArray[i].style.display = "block";
	}


}

function displaycompleteTask () {
	var chooseCategory = document.getElementsByClassName('choose')[0];
	var task = document.getElementsByClassName('task-list');
	for(var i = 0; i < task.length; i++) {
		task[i].style.display = "none";
	}
	var taskArray = [];
	var idNum = chooseCategory.getAttribute('id');
	//对于父类和子类显示不同的任务列表
	if (idNum.search('child') == -1 && chooseCategory.nextElementSibling.childElementCount > 0) {
		var children = chooseCategory.nextElementSibling.childNodes;
		for(var i = 0; i < children.length; i++) {
			var allTask = document.getElementsByClassName(children[i]
				.firstElementChild.getAttribute('id'));
			for(var j = 0; j < allTask.length; j++) {
				displayNodeTask(allTask[j]);
				if(!(allTask[j] in taskArray)) {
					var completeTask = allTask[j].getElementsByClassName('complete');
					if( completeTask.length == allTask[j].childElementCount - 1) {
						taskArray.push(allTask[j]);
					}
					else if (completeTask.length > 0) {
						var uncompleteTask = allTask[j].getElementsByClassName('unComplete');
						for(var n = 0; n < uncompleteTask.length; n++) {
							uncompleteTask[n].style.display = "none";
						}
						taskArray.push(allTask[j]);
					}
				}
			}
		}
		if (taskArray.length > 1) {
			taskArray.sort(sortDate);
			taskArray.forEach(function(a) {
					taskList.appendChild(a);
			})
			newtaskArray = taskArray.slice(0,-1);
			newtaskArray.forEach(function(a) {
				var prevDate = a.firstElementChild.textContent;
				var nextDate = a.nextElementSibling.firstElementChild.textContent;
				if(prevDate == nextDate) {
					a.nextElementSibling.firstElementChild.style.display = "none";
				}
			});
		}
	}
	else 
	{
		var allTask = document.getElementsByClassName(idNum);
		for(var j = 0; j < allTask.length; j++) {
			displayNodeTask(allTask[j]);
			if(!(allTask[j] in taskArray)) {
				var completeTask = allTask[j].getElementsByClassName('complete');
					if( completeTask.length == allTask[j].childElementCount - 1) {
						taskArray.push(allTask[j]);
					}
					else if (completeTask.length > 0) {
						var uncompleteTask = allTask[j].getElementsByClassName('unComplete');
						for(var n = 0; n < uncompleteTask.length; n++) {
							uncompleteTask[n].style.display = "none";
						}

					taskArray.push(allTask[j]);
				}
			}
		}
	}

	taskArray.sort(sortDate);

	function sortDate(a, b) {
		return parseInt(a.firstChild.textContent.replace(/\-/g, '')) 
		- parseInt(b.firstChild.textContent.replace(/\-/g, ''));  
	}
	taskArray.forEach(function(a) {
		taskList.appendChild(a);
	})

	for(var i = 0; i < taskArray.length; i++) {
		taskArray[i].style.display = "block";
	}


}

function dateSort() {
	var task = document.getElementsByClassName('task-list');
	var taskArray = [];
	for(var i = 0; i < task.length; i++) {
		taskArray.push(task[i]);
	}

	taskArray.sort(sortDate);

	function sortDate(a, b) {
		return parseInt(a.firstChild.textContent.replace(/\-/g, '')) 
		- parseInt(b.firstChild.textContent.replace(/\-/g, ''));  
	}
	taskList.innerHTML = "";
	taskArray.forEach(function(a) {
		taskList.appendChild(a);
	})
}

function displayNodeTask(node) {
	var completeTask = node.getElementsByClassName('complete');
	var uncompleteTask = node.getElementsByClassName('unComplete');
	var taskDate = node.getElementsByClassName('task-date');

	for(var i = 0; i < completeTask.length; i++) {
		completeTask[i].style.display = 'block';
	} 

	for(var i = 0; i < uncompleteTask.length; i++) {
		uncompleteTask[i].style.display = 'block';
	}

	for(var i = 0; i < taskDate.length; i++) {
		taskDate[i].style.display = 'block';
	}

}

var myStorage = window.localStorage;
function save() {
	myStorage.category = JSON.stringify(category);
	myStorage.subCategory = JSON.stringify(subCategory);
	myStorage.mission = JSON.stringify(mission);
}

var idFather = 1;
var idChild = 1;
var taskID = 1;
window.onload = initialize;
function initialize() {
	if(localStorage.category) {
		category = JSON.parse(localStorage.category);
		subCategory = JSON.parse(localStorage.subCategory);
		mission = JSON.parse(localStorage.mission);
	}
	for(var i = 0; i < category.length; i++) {
		var newTasks = new Categorys(category[i].name, category[i].id);
		idFather++;
		select.innerHTML += '<option>' + category[i].name + '</option';
	}

	for(var i = 0; i < subCategory.length; i++) {
		var newSubTasks = new SubCategory(
			subCategory[i].name,
			subCategory[i].id,
			subCategory[i].father);
		idChild++;
	}

	for(var i = 0; i < mission.length; i++) {
		var newTask = new Tasks(
			mission[i].name,
			mission[i].date,
			mission[i].content,
			mission[i].belong,
			mission[i].id,
			mission[i].completeState);
		taskID++;
	}

	var event = document.createEvent('MouseEvents');
	//对事件初始化
	event.initEvent('click', true, true);
	//触发事件
	defaultFile.firstElementChild.dispatchEvent(event);
}



function Categorys(categoryName, id) {
	
	this.categoryName = categoryName;
	this.newFile = document.createElement('li');
	this.newFile.className = "addfile";
	this.id = id;
	this.newFile.innerHTML = "<p class='on-category'"
	+"id=" + this.id + ">" 
	+"<i class='ico ico-18 ico-cate'></i>"  
	+ this.categoryName 
	+"<span>" + '(0)' + "</span>"
	+"<i class='delete icon-delete'></i>"
	+"</p>";
	files.insertBefore(this.newFile, defaultFile);
	var temp = document.createElement('ul');
	temp.className = "subfile";
	this.newFile.appendChild(temp);

	//类选中事件监听
	this.newFile.firstElementChild.onclick = function(event) {
		choose(event);
			//自动触发中间栏所有任务的click事件
		var e = document.createEvent("MouseEvents");
		e.initEvent("click", true, true);
		taskState[0].dispatchEvent(e);
	}
	
	//鼠标悬停在分类事件监听(删除分类)
	var imgDelete = this.newFile.getElementsByClassName('delete')[0];
	var onCategory = this.newFile.getElementsByClassName('on-category')[0];
	onCategory.onmouseover = function() {
		imgDelete.style.display = "inline";
	}

	onCategory.onmouseout = function() {
		imgDelete.style.display = "none";
	}

	//删除分类图标单击事件监听
	imgDelete.onclick = function(event) {
		imgDeleteFunc(event, false);
	}
}

function SubCategory(categoryName, id, father) {

	this.categoryName = categoryName;
	var parent = document.getElementById(father);
	this.node = parent.parentNode;
	this.newFile = document.createElement('li');
	this.newFile.className = "addfile";
	this.id = id;

	var fatherID = this.node.firstElementChild.getAttribute('id')
	this.newFile.innerHTML = "<p class='on-category'"
	+"id=" + this.id + ">"
	+"<i class='ico ico-18 ico-subcate'></i>"   
	+ this.categoryName 
	+"<span>" + '(0)' + "</span>"
	+"<i class='delete icon-delete'></i>"
	+"</p>";
	var ulNode = this.node.getElementsByTagName('ul')[0];
	ulNode.appendChild(this.newFile);

	this.newFile.firstElementChild.onclick = function(event) {
		choose(event);
			//自动触发中间栏所有任务的click事件
		var e = document.createEvent("MouseEvents");
		e.initEvent("click", true, true);
		taskState[0].dispatchEvent(e);
	}
	
	//鼠标悬停在分类事件监听(删除分类)
	var imgDelete = this.newFile.getElementsByClassName('delete')[0];
	var onCategory = this.newFile.getElementsByClassName('on-category')[0];
	onCategory.onmouseover = function() {
		imgDelete.style.display = "inline";
	}

	onCategory.onmouseout = function() {
		imgDelete.style.display = "none";
	}

	//删除分类图标单击事件监听
	
	imgDelete.onclick = function(event) {
		imgDeleteFunc(event, true);
	}
}


function imgDeleteFunc(event, tag) {
	//当触发删除click事件时，类的click(choose)取消
	event.target.parentNode.onclick = null;
	var task = document.getElementsByClassName('task')[0];
	var confirmDelete = confirm("确认删除该分类么？");
	if(confirmDelete) {

		if(tag) {
			var deleteTaskNum = parseInt(event.target.previousElementSibling.textContent.match(/\(([0-9]+)\)/)[1]);
			var fatherID = event.target.parentNode.getAttribute('id').replace(/child[0-9]+\-/,'');
			var parentCategory = document.getElementById(fatherID);
			var orignalNum = parseInt(parentCategory.textContent.match(/\(([0-9]+)\)/)[1]);
			var span = parentCategory.getElementsByTagName('span')[0];
			span.textContent = '('+(orignalNum-deleteTaskNum) + ')';

			var deleteID = event.target.parentNode.getAttribute('id');
			var deleteTask = document.getElementsByClassName(deleteID);
			for (var i = 0; i < deleteTask.length; i++) {
				task.removeChild(deleteTask[i]);
				mission = mission.filter(function(item, index, array) {
					return item.belong != deleteID;
				});
			}
			subCategory = subCategory.filter(function(item, index, array) {
				return item.id != deleteID;
			});
			save();
			parentCategory.nextElementSibling.removeChild(event.target.parentNode.parentNode);
		}
		else {
			//删除让新建任务弹出栏的分类option
			var deleteCategoryName = event.target.parentNode.textContent.replace(/\([0-9]+\)/,"");
			var select = document.getElementsByClassName('select-category')[0];
			var options = document.getElementsByTagName('option');
			for(var i = 0; i < options.length; i++) {
				if (options[i].textContent == deleteCategoryName) {
					select.removeChild(options[i]);
				}
			}
			files.removeChild(event.target.parentNode.parentNode);
			var deleteID = event.target.parentNode.getAttribute('id');
			var temp = event.target.parentNode.nextElementSibling;
			var deleteCategory = temp.getElementsByClassName('on-category');
			if(deleteCategory.length > 0) {
				for(var i = 0; i < deleteCategory.length; i++) {
					var deleteSubID = deleteCategory[i].getAttribute('id');
					var deleteTask = document.getElementsByClassName(deleteSubID);
					for (var i = 0; i < deleteTask.length; i++) {
					task.removeChild(deleteTask[i]);			
					}
					mission = mission.filter(function(item, index, array) {
						return item.belong != deleteSubID;
					});
					subCategory = subCategory.filter(function(item, index, array) {
						return item.id != deleteSubID;
					});
				}
				category = category.filter(function(item, index, array) {
					return item.id != deleteID;
				});
				save();

			}
			else {
				
				var deleteTask = document.getElementsByClassName(deleteID);
				for (var i = 0; i < deleteTask.length; i++) {
					task.removeChild(deleteTask[i]);
				}
				mission = mission.filter(function(item, index, array) {
					return item.belong != deleteID;
				});
				category = category.filter(function(item, index, array) {
					return item.id != deleteID;
				});
				save();
			}
		}
	}
	//删除结束后返回默认分类
	//创建事件
	var event = document.createEvent('MouseEvents');
	//对事件初始化
	event.initEvent('click', true, true);
	//触发事件
	defaultFile.firstElementChild.dispatchEvent(event);
}

function Tasks(name, date, content, belong, id, completeState) {

	this.name = name;
	this.date = date;
	this.content = content;

	//创建任务名称节点
	this.createTaskName =function() {
		var taskName = document.createElement('p');
		taskName.className = "task-name " + completeState;
		taskName.innerHTML = "<i class='ico ico-18 ico-complete'></i>" + this.name;
		taskName.setAttribute('id', id);
		taskName.style.borderBottom = "1px solid #D4D4D4";

		//记录在分类中的任务数量
		var chooseCategory = document.getElementById(belong);
		if (chooseCategory) {
			var taskNumber = chooseCategory.getElementsByTagName('span')[0];
			var num =  parseInt(taskNumber.textContent.match(/\(([0-9]+)\)/)[1]) + 1
			taskNumber.textContent = taskNumber.textContent.replace(/\(([0-9]+)\)/, '(' + num + ')');
			var chooseCategoryDadId = chooseCategory.getAttribute('id').replace(/^c(.*?)\-/, '');
			if(chooseCategoryDadId != belong) {
				var chooseCategoryDad = document.getElementById(chooseCategoryDadId);
				var taskNumberDad = chooseCategoryDad.getElementsByTagName('span')[0];
				var numDad =  parseInt(taskNumberDad.textContent.match(/\(([0-9]+)\)/)[1]) + 1
				taskNumberDad.textContent = taskNumberDad.textContent.replace(/\(([0-9]+)\)/, '(' + numDad + ')');
				}
		}

		return taskName;
	}

	/*this.returnID = function() {
		return taskID;
	}*/


	//创建任务时间节点
	this.createTaskDate = function() {
		var taskNode = document.createElement('li');
		taskNode.className = "task-list " + belong;
		taskList.appendChild(taskNode);
		var deadline = document.createElement('p');
		deadline.className = "task-date";
		deadline.textContent = this.date;
		taskNode.appendChild(deadline);
	    taskName = this.createTaskName();
		taskNode.appendChild(taskName);
	}

	//根据仍任务时间聚类
	var taskDate = document.getElementsByClassName('task-date');
	if (taskDate.length != 0) {
		var taskLi = document.getElementsByClassName(belong);
		var tag = true;
		for (var i = 0; i < taskLi.length; i++) {
			if (this.date == taskLi[i].firstElementChild.firstChild.textContent) {
				tag = false;
				var taskName = this.createTaskName();
				taskLi[i].insertBefore(taskName,taskLi[i].firstElementChild.nextElementSibling);
			}
		}
		if (tag) {
			this.createTaskDate();
		}
	}
	else{	
		this.createTaskDate();
	}

	//中栏任务名称单击事件监听
	taskName.onclick = function() {
		var taskNameMiddle = document.getElementsByClassName('task-name');
		for(var i = 0; i < taskNameMiddle.length; i++) {
			taskNameMiddle[i].style.backgroundColor = "#FFFFFF";	 
			taskNameMiddle[i].className = taskNameMiddle[i].className
			.replace(' choose-task', '');
		}

		this.style.backgroundColor = "#8DB6CD";
		this.className += " choose-task";

		var taskNameView = document.getElementsByClassName('task-name-v')[0];
		while (taskNameView.firstChild.nodeType == 3) {
			taskNameView.removeChild(taskNameView.firstChild);
		}
		var temp = document.createTextNode(this.textContent);
		var imgComplete = document.getElementsByClassName('icon-complete')[0];
		taskNameView.insertBefore(temp, imgComplete);
		var taskDateView = document.getElementsByClassName('task-date-v')[0];
		taskDateView.textContent = this.parentNode.firstElementChild.textContent;	
		var taskContentView	= document.getElementsByClassName('task-content-v')[0];
		//对当前的任务内容记录
		if(taskCurrentID && taskCurrentID == this.getAttribute('id')) {
			taskContentView.textContent = chooseContent;  
		}
		else {
			taskContentView.textContent = content;
		}
		/*taskContentView.textContent = content;*/

		if (this.className.search('complete') != -1) {
			imgComplete.style.display = "none";
			imgEdit.style.display = "none";	
		} else {
			imgComplete.style.display = "inline";
			imgEdit.style.display = "inline";	
		}
		viewTask.style.display = "block";
	};
}