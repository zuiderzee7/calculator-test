/*
 * 파일명: LazyLoaderModule.class.js
 * 작성자: 개발팀
 * 생성일: 2024-8-21
 * 마지막 수정자: 박정록
 * 마지막 수정일: 2024-09-06 03:13:47
 * 수정내용:
 *    - 이스크립트가 들어간 페이지는 커스텀 태그가 존재할경우 스크립트를 자동으로 로드해준다.
 * HTML의 head 태그 안에 있을때 정상동작함을 확인 했슴
 * script의 기본 경로는 이 스크립트 로딩시 태그속성 data-root를 사용한다.
 * #loadScript() 호출시 import 사용 버전
 */

class LazyLoader
{
	static #instance;
	#scriptRoot;
	#hash;
	#observer;

	constructor()
	{
		if (LazyLoader.#instance)
		{
			return LazyLoader.#instance;
		}

		const url = new URL(document.currentScript.src);

		document.currentScript.dataset.root ??= '/skin/ko/assets/js';
		this.#scriptRoot = document.currentScript.dataset.root;

		this.#hash = `${url.search}&root=${this.#scriptRoot}`;

		if ("MutationObserver" in window)
		{
			this.#observer = new MutationObserver(this.#handleMutations.bind(this));
			this.#observer.observe(document, { childList: true, subtree: true });
		}

		LazyLoader.#instance = this;
	}

	#handleMutations(mutationsList)
	{
		for (let mutation of mutationsList)
		{
			if (mutation.type === 'childList')
			{
				mutation.addedNodes.forEach(node =>
				{
					if (node.nodeType === Node.ELEMENT_NODE && node.nodeName.match(/^(wdgt|cmp|cls)-/i) && !customElements.get(node.nodeName.toLowerCase()))
					{
						this.whenDefined(node.nodeName);
					}
				});
			}
		}
	}

	 /**
	 * 노드 이름에서 네임스페이스와 클래스 이름을 추출한다.
	 * @param {string} nodeName - 노드 이름
	 * @returns {{ namespace: string, className: string }} - 네임스페이스와 클래스 이름
	 */
	#parseNodeName(nodeName)
	{
		const dirs = { wdgt: 'widget', cmp: 'component', cls: 'class', model: 'model' };
		const [prefix, ...rest] = nodeName.toLowerCase().split('-');

		const className = rest.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join('');

		return { namespace: dirs[prefix], className: className };
	}

	/**
	 * 주어진 네임스페이스와 클래스 이름에 대한 스크립트 URI를 생성한다.
	 * @param {string} namespace - 네임스페이스
	 * @param {string} className - 클래스 이름
	 * @returns {string} - 스크립트 URI
	 */
	#getUri(namespace, className)
	{
		return `${this.#scriptRoot}/${namespace}/${className}.class.js` + this.#hash;
	}

	static getInstance()
	{
		if (!LazyLoader.instance)
		{
			console.log('LazyLoader.getInstance() created');
			LazyLoader.instance = new LazyLoader();
		}

		return LazyLoader.instance;
	}

	 /**
	 * 주어진 노드 이름에 해당하는 클래스가 정의되었는지 확인하고, 정의되지 않은 경우 로드한다.
	 * @param {string} nodeName - 노드 이름
	 * @returns {Promise<any>} - 클래스가 정의되어 있으면 클래스 자체를 반환, 아니면 Promise를 반환
	 */
	async whenDefined(nodeName)
	{
		const { namespace, className } = this.#parseNodeName(nodeName);

        return await import(this.#getUri(namespace, className));
	}
}

// DOM생성전에 MutationObserver를 설정하기 위해 미리 호출
LazyLoader.getInstance();
