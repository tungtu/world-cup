jQuery(document).ready(function () {

	/*
		Fullscreen background
	*/
	// $.backstretch([
	//                 "/stylesheets/assets/img/backgrounds/2.jpg"
	//              , "/stylesheets/assets/img/backgrounds/3.jpg"
	//              , "/stylesheets/assets/img/backgrounds/1.jpg"
	//             ], {duration: 3000, fade: 750});

	/*
		Form validation
	*/
	$('.login-form input[type="text"], .login-form input[type="password"], .login-form textarea').on('focus', function () {
		$(this).removeClass('input-error');
	});

	$('.login-form').on('submit', function (e) {

		$(this).find('input[type="text"], input[type="password"], textarea').each(function () {
			if ($(this).val() == "") {
				e.preventDefault();
				$(this).addClass('input-error');
			}
			else {
				$(this).removeClass('input-error');
			}
		});

	});

	var datatableInit = function () {
		var $table = $('.datatable-tabletools');

		if ($table.length > 0)
			$table.DataTable({
				sDom: "<'text-right mb-md'T>" + $.fn.dataTable.defaults.sDom,
				"oTableTools": {
					"sSwfPath": "/swf/copy_csv_xls_pdf.swf"
				}
			});
	};

	datatableInit();

	$('body').on('hidden.bs.modal', '.modal', function () {
		$(this).removeData('bs.modal');
	});

	//sweetalert
	jQuery(".btn-choose").click(function (e) {
		var $this = jQuery(this);
		swal({
				title: "Mày có chắc chưa, đừng nghe ai dụ nha ?",
				text: "Chọn rồi là không được chọn lại đâu nha!",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Ok, Tao biết rồi!",
				cancelButtonText: "Từ từ đợi xí!",
				closeOnConfirm: false,
				closeOnCancel: false
			},
			function (isConfirm) {
				if (isConfirm) {
					window.location = $this.attr('href');
				} else {
					swal("Cancelled", "Suy nghĩ kĩ đi :)", "error");
				}
			});
		e.preventDefault();
	});

	var alertMessage = jQuery(".alert-message");
	var errorMessage = jQuery(".error-message");

	if (alertMessage.length > 0) {
		var data_text = alertMessage.attr('data-text');
		var data = data_text.split(',');
		switch ($.trim(data[2])) {
			case 'success':
				swal(data[0], data[1], "success");
				break;
			case 'warning':
				swal(data[0], data[1], "warning");
				break;
			case 'error':
				swal(data[0], data[1], "error");
				break;
		}

	}

	if (errorMessage.length > 0) {
		var data_text = errorMessage.attr('data-text');
		swal("Error !", data_text, "error");

	}

});
