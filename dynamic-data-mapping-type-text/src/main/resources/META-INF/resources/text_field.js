AUI.add(
	'liferay-ddm-form-field-text',
	function(A) {
		var Renderer = Liferay.DDM.Renderer;

		var Util = Renderer.Util;

		new A.TooltipDelegate(
			{
				position: 'left',
				trigger: '.liferay-ddm-form-field-text .help-icon',
				triggerHideEvent: ['blur', 'mouseleave'],
				triggerShowEvent: ['focus', 'mouseover'],
				visible: false
			}
		);

		var TextField = A.Component.create(
			{
				ATTRS: {
					displayStyle: {
						state: true,
						value: 'singleline'
					},

					initialHeight: {
						value: 0
					},

					options: {
						value: []
					},

					placeholder: {
						state: true,
						value: ''
					},

					type: {
						value: 'text'
					}
				},

				EXTENDS: Liferay.DDM.Renderer.Field,

				NAME: 'liferay-ddm-form-field-text',

				prototype: {
					initializer: function() {
						var instance = this;

						instance._eventHandlers.push(
							instance.after('valueChange', instance._onTextFieldValueChange)
						);

						instance.evaluate = A.debounce(
							function() {
								TextField.superclass.evaluate.apply(instance, arguments);
							},
							300
						);
					},

					getChangeEventName: function() {
						return 'input';
					},

					render: function() {
						var instance = this;

						TextField.superclass.render.apply(instance, arguments);

						if (instance.get('displayStyle') === 'multiline') {
							instance._setInitialHeight();
							instance.syncInputHeight();
						}

						return instance;
					},

					showErrorMessage: function() {
						var instance = this;

						TextField.superclass.showErrorMessage.apply(instance, arguments);

						var container = instance.get('container');

						var formGroup = container.one('.form-group');

						formGroup.insert(container.one('.form-feedback-item'), 'after');
					},

					syncInputHeight: function() {
						var instance = this;

						var inputNode = instance.getInputNode();

						var initialHeight = instance.get('initialHeight');

						inputNode.setStyle('height', initialHeight);

						var height = inputNode.get('scrollHeight');

						if (height > initialHeight) {
							inputNode.setStyle('height', height);
						}
					},

					_onTextFieldValueChange: function() {
						var instance = this;

						if (instance.get('displayStyle') === 'multiline') {
							instance.syncInputHeight();
						}
					},

					_setInitialHeight: function() {
						var instance = this;

						var inputNode = instance.getInputNode();

						var initialHeightInPx = inputNode.getStyle('height');

						var initialHeight = parseInt(initialHeightInPx, 10);

						instance.set('initialHeight', initialHeight);
					}
				}
			}
		);

		Liferay.namespace('DDM.Field').Text = TextField;
	},
	'',
	{
		requires: ['aui-autosize-deprecated', 'aui-tooltip', 'liferay-ddm-form-renderer-field']
	}
);