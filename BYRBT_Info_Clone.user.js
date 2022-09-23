// ==UserScript==
// @name        BYRBT Info Clone
// @author      liuwilliam
// @author      Original Author: Deparsoul
// @description 一键克隆已有种子的信息
// @include     http*://byr.pt*/torrents.php*
// @include     http*://byr.pt*/upload.php?type=*
// @include     http*://byr.pt*/details.php*
// @icon        http://byr.pt/favicon.ico
// @grant       none
// @version     1.0.2
// @updateURL   https://raw.githubusercontent.com/liuwilliamBUPT/BYRBT-Info-Clone/master/BYRBT_Info_Clone.user.js
// @downloadURL https://raw.githubusercontent.com/liuwilliamBUPT/BYRBT-Info-Clone/master/BYRBT_Info_Clone.user.js
// @require     https://byr.pt/js/purify.min.js
// ==/UserScript==
'use strict'
window.script_version = ''
if (window.GM_info && window.GM_info.script) {
  window.script_version = window.GM_info.script.version || window.script_version
}

;(function ($) {
  // 在种子页面显示相关信息
  if ($('#kdescr').length) {
    // 显示克隆来源、脚本版本等信息
    const meta = $('#kdescr .byrbt_info_clone:last')
    if (meta.length) {
      $('#kdescr')
        .closest('tr')
        .after('<tr><td></td><td class="byrbt_info_clone_meta"></td></tr>')
      // eslint-disable-next-line camelcase
      const _meta = {
        td: $('.byrbt_info_clone_meta'),
        clone: (meta.data('clone') || '').toString().replace(/\D/g, ''),
        version: (meta.data('version') || '')
          .toString()
          .replace(/[^\dA-Za-z-. ]/g, '')
      }

      if (_meta.clone) {
        _meta.td.append(
          '种子信息克隆自 <a target="_blank" href="details.php?id=' +
            _meta.clone +
            '&hit=1">Torrent ' +
            _meta.clone +
            '</a> '
        )
      }
      _meta.td.append(
        '<div style="float:right">Powered by BYRBT Info Clone ' +
          _meta.version +
          '</div>'
      )
    }
    // 显示动漫信息卡片
    if (
      $('#type').text().trim() + '' === '动漫' &&
      $('#sec_type').text().trim() + '' === '动画'
    ) {
      const title = $('#share').text().trim()
      let match = title.match(/\[.*?\]\[.*?\]\[(.*?)\]\[(.*?)\]/)
      let titles = []
      if (match[1]) titles = titles.concat(match[1].split(/\s*\/\s*/))
      if (match[2]) titles.push(match[2])
      if (!titles.length) return
      match = title.match(/\[(\d{4})\.(\d+)\]/)
      let date
      if (match) {
        date = new Date([match[1], match[2], '1'].join('-'))
        date = date.getTime() / 1000
      }
      if (!date) return
      const query = titles.map(function (title) {
        return 'titles[]=' + encodeURIComponent(title)
      })
      query.push('date=' + date)
      const url =
        'https://anydb.depar.cc/anime/card?_cf_cache=1#fade&hover&' +
        query.join('&')
      console.log(url)
      const iframe = $(
        '<iframe scrolling="no" style="border:none;width:400px;height:200px;overflow:hidden;position:absolute;right:0;"></iframe>'
      )
      iframe.attr('src', url)
      $('#kdescr').css('position', 'relative').prepend(iframe)
    }
    return
  }

  // 为种子列表添加克隆按钮
  if ($('table.torrents').length) {
    $('table.torrents td.colhead:eq(0)').after('<td class="colhead"></td>')
    $('table.torrents>tbody>tr').each(function () {
      const tr = $(this)
      if (tr.find('table.torrentname').length) {
        const cat = tr
          .find('a[href^="?cat="]')
          .attr('href')
          .match(/cat=(\d+)/)[1]
        const id = tr
          .find('table.torrentname td:nth-child(1) a')
          .attr('href')
          .match(/id=(\d+)/)[1]
        tr.find('td:eq(0)').after(`
        <td class="rowfollow">
          <a title="点击克隆种子信息" target="_blank" href="upload.php?type=${cat}#clone_${id}">
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGHSURBVDhPfVHNTsJAEN538QVIfAyfgHLQUNQDD6EShCKevRhRiyYmejLRA0qhpQJiRBLjG+hJEyP+HBnn2+5qG1a/5Mu3MzszO/0q8tWD1+XKPuUqLrNuoEu4R50wAZfA1z8EUKdakrCdaMCtEDRk3jFHijiDQI7rVEsStuPKAgx4ZD0ZjuiZ9bTbpRfWBzVgkT9FtSShN9Cvo6E6lyarciiZ3jyijFOnhbJLtskXu7QnB5wFIb2zeoMBZbgR+FD8VDT6Ypd2ZdBoXtJFy6N+v0dWMcrFfdFEjDyA7YW9XpNBs+lJ7YUdsgo1mvBZ+3I8uqcnpYh/B7AvekDgtykMfLrpX1F6bUfm8Bqo/whU5wC5wVI58iAOa3VbKnx5Yz3vXdNYKWLkAfgn8hvuGEOwCZhjT+YL0QbwpeF51O6ECUUegH/4kynmbJzZmC8TNsPzWgnVfuFBrp9G3JfA9ylgb36ImPPAnwNMvpiAOtWShL2y1da+ZIvTRB738E+1TGGGmfDFTJH6Bk9fZApqlbl/AAAAAElFTkSuQmCC">
          </a>
        </td>
        `)
      }
    })
    return
  }

  // 在表单中添加一行，用于本脚本和用户交互
  $('#compose>table tr:eq(1)').after(
    '<tr><td class="rowhead nowrap">种子信息克隆</td><td style="text-align:left"><input type="text" class="clone_skip" style="text-align:start;width:140px;" id="clone_from"><input type="button" style="width:60px;" id="clone_btn" value="克隆">&nbsp;&nbsp;&nbsp;&nbsp;<span id="clone_info">要克隆的种子编号或者链接</span></td></tr>'
  )

  // 需要单独填写或者不需要填写的input
  $('input[name=small_descr]').addClass('clone_skip')
  $('input[name=url]').addClass('clone_skip')
  $('input[name=dburl]').addClass('clone_skip')

  // 通过分析种子，获取待发布文件名，并根据文件名自动填写表单中的某些字段
  let filename
  // TODO: Use this to simplify some logic.
  function getMatch (str, reg, group) {
    group = group || 1
    const match = str.match(reg)
    if (match && match[group]) return match[group]
    else return ''
  }
  function buildRegexp (template, array) {
    return new RegExp(template.replace('ARRAY', array.join('|')), 'i')
  }
  $('#compose>table tr:eq(3)').after(
    '<tr id="clone_auto"><td class="rowhead nowrap">自动填写</td><td style="text-align:left" id="clone_auto_fields"></td></tr>'
  )
  $('body').append(
    '<style>' +
      '.clone_auto_field {cursor:pointer;border:1px solid #999999;display:inline-block;margin:0 5px 0 0;padding:2px 5px;}' +
      '.clone_auto_field_name {color:gray;}' +
      '.clone_auto_field_new .clone_auto_field_val {font-weight:bold;color:red;}' +
      '</style>'
  )
  function analyzeFilename () {
    $('#clone_auto').hide()
    if (!filename) return
    const type = $('input[name=type]').val()
    let fields = {}
    switch (+type) {
      case 404:
        fields = {
          subteam: getMatch(filename, /^\[([^\]]+)\]\[([^\]]+)\]/, 1),
          comic_ename: getMatch(
            filename,
            /^\[([^\]]+)\]\[([^\]]+)\]/,
            2
          ).replace(/_/g, ' '),
          comic_episode: getMatch(filename, /\[(\d+)\]/),
          comic_quality: getMatch(
            filename,
            buildRegexp('\\[(ARRAY)\\]', window.comic_quality_array)
          ).toLowerCase(),
          comic_filetype: getMatch(
            filename,
            buildRegexp('\\.(ARRAY)$', window.comic_filetype_array)
          ).toUpperCase()
        }
        break
      case 401:
        fields = {
          tv_ename: filename,
          // TODO: check this.
          // eslint-disable-next-line no-useless-escape
          tv_season: getMatch(filename, /\.([S\dE\-]+)\./),
          tv_filetype: getMatch(
            filename,
            buildRegexp('\\.(ARRAY)$', window.tv_filetype_array)
          ).toUpperCase()
        }
        if (fields.tv_filetype) {
          fields.tv_ename = filename.replace(
            new RegExp('\\.' + fields.tv_filetype + '$', 'i'),
            ''
          )
        }
        break
      case 408:
        fields = {
          ename0day: filename
        }
        break
      default:
        break
    }
    $('#clone_auto_fields').html('')
    for (const key in fields) {
      const val = fields[key]
      const input = $('[name=' + key + ']')
      if (!val || !input.length) continue
      const name = input.closest('tr').find('td:eq(0)').text()
      const span = $(`
        <span class="clone_auto_field">
          <span class="clone_auto_field_name"> 
            ${name}
          </span>
          <span class="clone_auto_field_val">
            ${val}
          </span>
        </span>
      `)
      span.data('key', key)
      span.data('val', val)
      if (input.val() !== val) span.addClass('clone_auto_field_new')
      $('#clone_auto_fields').append(span)
    }
    if (+type === 404) {
      const link = $(
        '<a rel="noopener noreferrer">动漫板块推荐尝试全新的 BYRBT Bangumi Info 脚本，对于多数新番可以全自动生成包括简介在内的大部分信息</a>'
      )
      if ($('#bangumi_info_row').length) {
        link.attr('href', '#bangumi_info_row').click(function () {
          $('#bangumi_info_process').click()
        })
      } else {
        link
          .attr(
            'href',
            'https://greasyfork.org/zh-CN/scripts/39367-byrbt-bangumi-info'
          )
          .attr('target', '_blank')
      }
      $('#clone_auto_fields').append('<br>').append(link)
    }
    $('#clone_auto_fields').append(
      '<br>从种子文件中分析出以上字段，请点击想要填写的字段，<span class="clone_auto_field_new"><span class="clone_auto_field_val">高亮</span></span>表示与下方目前填写的内容不同，该功能目前处于测试阶段，适配了动漫、剧集、电影板块，欢迎反馈'
    )
    if ($('.clone_auto_field').length) $('#clone_auto').show()
  }
  analyzeFilename()
  $('#clone_auto_fields').on('click', '.clone_auto_field', function () {
    const span = $(this)
    const input = $('[name=' + span.data('key') + ']')
    input.val(span.data('val'))
    analyzeFilename()
  })
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    document.getElementById('torrent').addEventListener('change', function (e) {
      filename = ''
      const f = e.target.files[0]
      if (f) {
        const r = new FileReader()
        r.onload = function (e) {
          const torrent = e.target.result
          const match = torrent.match(/4:name(\d+):(.*)/)
          if (match) filename = match[2].substring(0, match[1])
          analyzeFilename()
        }
        r.readAsText(f)
      }
    })
  }

  // 点击克隆按钮
  $('#clone_btn').click(function () {
    // 获取要克隆的种子编号
    let from = $('#clone_from').val().trim()
    const info = $('#clone_info')
    const match = from.match(/id=(\d+)/)
    if (match) {
      from = match[1]
    }
    if (/^\d+$/.test(from)) {
      // 如果输入了有效的编号，开始读取对应的种子页面
      info.text('正在读取')
      $.get(
        'details.php?id=' + from + '&hit=1&ModPagespeed=off',
        function (resp) {
          info.text('正在分析')
          const regex = /var dirty = '([^]*)';\n/gm
          let m
          let dirty
          while ((m = regex.exec(resp)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            dirty = m[1]
          }
          dirty = dirty.replace(/\\"/g, '"').replace(/\\r\\n/g, '\r\n')
          const clean = window.DOMPurify.sanitize(dirty)

          let title = resp.match(/<title[^>]*>[\s\S]*<\/title>/gi)[0]
          const body = resp.match(/<body[^>]*>[\s\S]*<\/body>/gi)[0]
          const page = $(body) // 构造 jQuery 对象
          let match = title.match(/种子详情 &quot;(.*)&quot; - Powered/)
          if (!match) {
            info.text('失败，可能由于种子不存在或者网络问题')
            return
          }

          // 利用种子标题中的信息填写表单
          title = $('<textarea />').html(title).text() // 处理HTML entity
          // 将标题中的字段拆开
          const fields = title.match(/\[[^\]]*\]/g)
          for (let i = 0; i < fields.length; ++i) {
            fields[i] = fields[i].replace(/^\[|\]$/g, '')
          }
          let next = 0
          let checkArray = true // 是否需要检查字段取值
          const inputCount = $('#compose :text:not(.clone_skip)').length
          if (inputCount === fields.length - 1) {
            fields.shift() // 处理二级标题带来的多余字段
          }
          if (inputCount === fields.length) {
            // 如果标题中的字段数和需要填写的字段数一致，则不进行字段取值检查
            checkArray = false
          }
          $('#compose :text').each(function () {
            if (next >= fields.length) return
            let nextValue = fields[next]
            const input = $(this)

            // 判断是否可以填入
            let fill = true
            if (input.hasClass('clone_skip')) fill = false
            if (checkArray && input.attr('onfocus')) {
              fill = false
              match = input.attr('onfocus').match(/showselect\("([^"]+)"\)/)
              if (match) {
                // eslint-disable-next-line no-eval
                const arr = eval(match[1] + '_array')
                if (arr) {
                  nextValue = (() => {
                    switch (match[1]) {
                      case 'movie_type':
                      case 'record_area':
                        return nextValue
                          .split('/')
                          .reduce((pre, cur) => {
                            if (arr.indexOf(cur) < 0) {
                              return pre
                            }
                            fill = true
                            pre.push(cur)
                            return pre
                          }, [])
                          .join('/')
                      case 'record_type':
                      case 'record_group':
                        // If in documentary upload page, this is the only possibility.
                        if (next === 1) {
                          fill = true
                          return nextValue
                        } else if (fields.length - next === 2) {
                          // Including omit season field.
                          fill = true
                          return nextValue
                        }
                        break
                      case 'record_season':
                        {
                          const regex = /(S[0-2][1-9](E[0-2][1-9])?|全\d+集)/gm
                          let m
                          if (
                            (m = regex.exec(nextValue)) !== null &&
                            m[0] === nextValue
                          ) {
                            fill = true
                            return nextValue
                          }
                        }
                        break
                      case 'record_filetype':
                      case 'comic_quality': {
                        // Use brace to avoid redeclare.
                        const regex = /^(2160p|4K)$/gm
                        let m
                        if (
                          // TODO: To perf this.
                          (m = regex.exec(nextValue)) !== null &&
                          m.length === 2 &&
                          nextValue === m[1]
                        ) {
                          fill = true
                          return nextValue
                        }
                      }
                      // If not 2160p or 4K continue to default.
                      // eslint-disable-next-line no-fallthrough
                      default:
                        if (arr.indexOf(nextValue) >= 0) {
                          fill = true
                          return nextValue
                        }
                    }
                  })()
                }
              }
            }
            if (fill) {
              input.val(nextValue)
              ++next
            }
          })

          // 填写二级类型
          $(
            'select[name=second_type] option:contains(' +
              page.find('#sec_type').text() +
              ')'
          ).attr('selected', 'selected')

          // 填写副标题
          $('input[name=small_descr]').val(page.find('#subtitle li').text())

          // 填写IMDb链接
          if (page.find('.imdbRatingPlugin').length) {
            $('input[name=url]').val(
              'http://www.imdb.com/title/' +
                page.find('.imdbRatingPlugin').data('title') +
                '/'
            )
          }

          // 填写豆瓣链接
          $('input[name=dburl]').val(
            page
              .find('.rowhead:contains("豆瓣信息")')
              .next()
              .find('a[href*="://movie.douban.com/subject/"]')
              .text()
          )

          // 填写bgm.tv链接
          $('input[name=bgmtv_url]').val(
            page
              .find('.rowhead:contains("BGMTV信息")')
              .next()
              .find('a[href*="://bgm.tv/subject/"]')
              .text() || page.find('.byrbt_bangumi_info_reference_bgm').text()
          )

          // 填写描述

          const temp = document.createElement('div')
          temp.innerHTML = clean
          const descr = $(temp)
          // 还原图片链接
          descr.find('img').each(function () {
            const img = $(this)
            img.removeAttr('onload')
            img.removeAttr('pagespeed_url_hash')
            img.removeAttr('data-pagespeed-url-hash')
            let src = img.attr('src')
            src = src.replace(
              /images\/(\d+x\d+x|x)(.*)\.pagespeed\.ic.*/g,
              'images/$2'
            )
            img.attr('src', src)
          })
          // 移除无需复制的元素
          descr.find('.byrbt_info_clone_ignore').remove()
          descr.find('.autoseed').remove()
          // 添加元信息
          descr.find('.byrbt_info_clone').remove()

          descr.append(`
            <div class="byrbt_info_clone" data-clone="${from}" data-version="${window.script_version}" style="display:none">
              <a href="https://github.com/liuwilliamBUPT/BYRBT-Info-Clone">
                Powered by BYRBT Info Clone
              </a>
            </div>
          `)
          window.CKEDITOR.instances.descr.setData(descr.html())

          // 默认勾选匿名
          $('input[name=uplver]').prop('checked', true)

          info.text('克隆完成')

          analyzeFilename()
        }
      )
    } else {
      alert('请输入有效的种子编号或者链接')
    }
    return false
  })

  window.CKEDITOR.on('instanceReady', function (evt) {
    // 检查hash中是否指定了需要克隆的种子
    const match = location.href.match(/#clone_(\d+)/)
    if (match) {
      history.pushState(
        '',
        document.title,
        window.location.pathname + window.location.search
      ) // 清空hash
      $('#clone_from').val(match[1])
      $('#clone_btn').click()
    }
  })
})(window.jQuery)
