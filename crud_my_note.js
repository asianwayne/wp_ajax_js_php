//集合了CRUD 所有操作的 rest api 
import $ from 'jquery';

class MyNotes {
	constructor() {
		this.events();
	}

	events() {

		//$(".delete-note").on("click",this.deleteNote.bind(this));只对存在的.delete-note有用对将来存在的没用，所以create note时候的edit button没用， 因为create note时候加载的edit 按钮不是在文档加载之后就加载的
		//所以要更换selector. 要选择上级的ul。 上级的ul包含现在或者以后的包含带.delete-note的项目
		//所以.on方法可以包含第三个参数， 加在中间，意思是当执行click的eventlistner时候寻找后面的这个item然后执行后面的callback参数。 fire off our callback method.
		//When you click always exist #my-note element, if the actual interial 
		
		$("#my-notes").on("click",".delete-note",this.deleteNote.bind(this)); 
		//when click and fire of the function response it is going to pass along the information about the event into the callback function deleteNote()， 也就是下面deleteNote(e)传递的e。 
		$("#my-notes").on("click",".edit-note",this.editNote.bind(this));

		$('#my-notes').on('click',".update-note",this.updateNote.bind(this));
		$('.submit-note').on('click',this.createNote.bind(this));
	}

	editNote(e) {
		var thisNote = $(e.target).parents("li");

		if(thisNote.data('status') == 'editable') {
			this.makeNoteReadOnly(thisNote);  // 因为thisNote是这个函数定义的所以要传递到makeNote这个函数里。 
		} else {
			this.makeNoteEditable(thisNote);
		}
	}

	makeNoteEditable(thisNote) {
		thisNote.find('.edit-note').html('<i class="fa fa-times" aria-hidden="true"></i>Cancle');

		thisNote.find(".note-title-field,.note-body-field").removeAttr("readonly").addClass("note-active-field");
		thisNote.find(".update-note").addClass("update-note--visible");
		thisNote.data('status','editable');
	}
	makeNoteReadOnly(thisNote) {
		thisNote.find('.edit-note').html('<i class="fa fa-pencil" aria-hidden="true"></i>Edit');

		thisNote.find(".note-title-field,.note-body-field").attr("readonly","readonly").removeClass("note-active-field");
		thisNote.find(".update-note").removeClass("update-note--visible");
		thisNote.data('status','cancel');
	}

	//methods
	//
	createNote(e) {
		var ourNewPost = {
			'title':$('.new-note-title').val(), //跟rest api里面的obeject里面的item完全对应 
			'content':$(".new-note-body").val(),
			'status':'publish',  //设置status 为 private是最基本的方法，来实现发布的内容为private 仅作者自己可见并在rest api 隐藏。 更安全的方法的话要利用下面的js ,所以这里把status设置为publish. 注意；这个特征是client side feature 是客户端特征， 不能依靠去强迫改变status， 需要从服务器特征进行更改保证安全。 需要从functions.php里面去添加filter来实现。

		}
		$.ajax(
			//ajax tool control what request you want send
			{ //{ 大括号是创建javascript object}
				beforeSend:(xhr) => {
					xhr.setRequestHeader('X-WP-Nonce',universityData.nonce);
				},
				url:universityData.root_url + '/wp-json/wp/v2/note/', //再POST的request里这个网址就是创建或者接受note有关的信息的，用GET的request的话就会收到十个note有关文章的json数据。
				type:'POST',  //send POST request Wordpress就会发送创造新帖子的请求
				data:ourNewPost, //send data along with request 传递参数
				success:(response) => {
					$(".new-note-title,.new-note-body").val('');
					$(`<li data-id="${response.id}">
           <input readonly class="note-title-field" type="text" value="${response.title.raw}">
           <span class="edit-note">
             <i class="fa fa-pencil" aria-hidden="true"></i>
             Edit
           </span>
           <span class="delete-note">
             <i class="fa fa-trash-o" aria-hidden="true"></i>
             Delete
           </span>
           
           <textarea readonly name="" id="" class="note-body-field" rows="10" cols="30">${response.content.raw}
           </textarea>
           <span class="update-note btn btn--blue btn--small">
             <i class="fa fa-arrow-right" aria-hidden="true"></i>
             Save
           </span>
         </li>`).prependTo("#my-notes").hide().slideDown();
					console.log("Congrates!");
					console.log(response);
				},
				error:(response) => {
					if (response.responseText == "You have reached your note limit!") {
						$(".note-limit-message").addClass("active");
					}
					console.log("Sorry");
					console.log(response);
				},
			});

	}
	deleteNote(e) {
		var thisNote = $(e.target).parents("li");  //click的item的上一级就是li,指向<li>item

		//nonce stands for number use once ,when you successfully log into a wordpress account,wordpress can generate a nonce for you
		//send delete request to the right url, 普遍网站有三种请求，GET, POST 和DELETE
		//$.getJSON( )  是send get request
		$.ajax(
			//ajax tool control what request you want send
			{ //{ 大括号是创建javascript object}
				beforeSend:(xhr) => {
					xhr.setRequestHeader('X-WP-Nonce',universityData.nonce);
				},
				url:universityData.root_url + '/wp-json/wp/v2/note/' + thisNote.data('id'), //data('id')  就是page-my-notes.php里面的 <li data-id="">
				type:'DELETE',
				success:(response) => {
					thisNote.slideUp();  //jquery method 的名字 remove the elemnt from the page in a nice slide up animation. 成功的时候移除的就是上面的url的object。
					console.log("Congrates!");
					console.log(response);
					if (response.userNoteCount < 20) {
						$(".note-limit-message").removeClass("active");
					}
				},
				error:(response) => {
					console.log("Sorry");
					console.log(response);
				},
			});}

	updateNote(e) {

		var thisNote = $(e.target).parents("li");  //click的item的上一级就是li,指向<li>item

		//nonce stands for number use once ,when you successfully log into a wordpress account,wordpress can generate a nonce for you
		//send delete request to the right url, 普遍网站有三种请求，GET, POST 和DELETE
		//$.getJSON( )  是send get request
		var ourUpdatedPost = {
			'title':thisNote.find(".note-title-field").val(), //跟rest api里面的obeject里面的item完全对应 
			'content':thisNote.find(".note-body-field").val(),
		}
		$.ajax(
			//ajax tool control what request you want send
			{ //{ 大括号是创建javascript object}
				beforeSend:(xhr) => {
					xhr.setRequestHeader('X-WP-Nonce',universityData.nonce);
				},
				url:universityData.root_url + '/wp-json/wp/v2/note/' + thisNote.data('id'), //data('id')  就是page-my-notes.php里面的 <li data-id="">
				type:'POST',
				data:ourUpdatedPost, //send data along with request 传递参数
				success:(response) => {
					this.makeNoteReadOnly(thisNote);
					console.log("Congrates!");
					console.log(response);
				},

				error:(response) => {
					
					console.log("Sorry");

					console.log(response);
				},
			});
	}
}

export default MyNotes;
